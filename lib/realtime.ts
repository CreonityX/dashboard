"use client"

// Minimal WebSocket client for the creator comms feed.
// Protocol (see backend src/modules/creator/routes/comms-ws.route.ts):
//   connect  ws(s)://<api-host>/api/v1/creator/ws?token=<access_jwt>
//   send     { type: "subscribe", workspaceId }
//   send     { type: "heartbeat" } every 60s (presence TTL refresh)
//   send     { type: "typing.start" | "typing.stop", channelId }
//   receive  message.created|edited|deleted, reaction.added|removed,
//            channel.updated, user.presence, typing.start|stop
//
// Design notes:
//   - The access token comes from getWsTokenAction (httpOnly cookie →
//     in-memory string). Never persisted.
//   - Auto-reconnect with capped backoff; resubscribes on reconnect.
//   - One socket per workspace. Callers share it via useRealtime().

import { useEffect, useRef, useState } from "react"
import { getWsTokenAction } from "@/app/actions/comms"

export type RealtimeEvent =
  | { type: "message.created"; messageId: string; channelId?: string; dmThreadId?: string; authorId: string; body: string; parentMessageId?: string | null; createdAt: string }
  | { type: "message.edited"; messageId: string; body: string }
  | { type: "message.deleted"; messageId: string }
  | { type: "reaction.added"; messageId: string; emoji: string; userId: string }
  | { type: "reaction.removed"; messageId: string; emoji: string; userId: string }
  | { type: "channel.updated"; channelId: string }
  | { type: "user.presence"; userId: string; status: "online" | "offline" }
  | { type: "typing.start"; channelId: string; userId: string }
  | { type: "typing.stop"; channelId: string; userId: string }
  | { type: string; [key: string]: unknown };

function wsBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";
  return base.replace(/^http/, "ws");
}

const HEARTBEAT_MS = 60_000;
const MAX_BACKOFF_MS = 15_000;

export function useRealtime(
  workspaceId: string | null,
  onEvent: (event: RealtimeEvent) => void,
): { connected: boolean; sendTyping: (channelId: string, typing: boolean) => void } {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;
  const workspaceRef = useRef(workspaceId);
  workspaceRef.current = workspaceId;

  useEffect(() => {
    if (!workspaceId) return;
    let closed = false;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let attempt = 0;
    let socket: WebSocket | null = null;

    const connect = async () => {
      const tokenRes = await getWsTokenAction();
      if (closed || !tokenRes.success) {
        if (!closed) {
          attempt += 1;
          setTimeout(connect, Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS));
        }
        return;
      }
      socket = new WebSocket(
        `${wsBase()}/api/v1/creator/ws?token=${encodeURIComponent(tokenRes.data.token)}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        attempt = 0;
        setConnected(true);
        socket?.send(JSON.stringify({ type: "subscribe", workspaceId: workspaceRef.current }));
        heartbeat = setInterval(() => {
          socket?.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ type: "heartbeat" }));
        }, HEARTBEAT_MS);
      };

      socket.onmessage = (ev) => {
        try {
          handlerRef.current(JSON.parse(ev.data as string) as RealtimeEvent);
        } catch {
          // malformed frame — ignore
        }
      };

      const reconnect = () => {
        setConnected(false);
        if (heartbeat) clearInterval(heartbeat);
        socketRef.current = null;
        if (!closed) {
          attempt += 1;
          setTimeout(connect, Math.min(1000 * 2 ** attempt, MAX_BACKOFF_MS));
        }
      };
      socket.onclose = reconnect;
      socket.onerror = () => socket?.close();
    };

    void connect();
    return () => {
      closed = true;
      if (heartbeat) clearInterval(heartbeat);
      socket?.close();
      socketRef.current = null;
    };
  }, [workspaceId]);

  const sendTyping = (channelId: string, typing: boolean) => {
    const s = socketRef.current;
    if (s && s.readyState === WebSocket.OPEN) {
      s.send(JSON.stringify({ type: typing ? "typing.start" : "typing.stop", channelId }));
    }
  };

  return { connected, sendTyping };
}
