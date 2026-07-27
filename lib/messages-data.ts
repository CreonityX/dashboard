import type { AvatarTone } from "@/components/messages/gradient-avatar"

export type Sender = "me" | "them"

type Base = { 
  id: string; 
  sender: Sender; 
  time: string; 
  senderName?: string; 
  senderTone?: AvatarTone;
  replyTo?: any; // Using any to avoid circular definition issues if any, though TS usually handles it. Actually, better yet, we can use `Message` if we use an interface or a recursive type. Let's try `replyTo?: any` for simplicity since this is UI data. Or `replyTo?: Message`.
}

export type Message =
  | (Base & { kind: "text"; text: string })
  | (Base & { kind: "image"; src: string; caption?: string })
  | (Base & { kind: "video"; src: string; duration: string; caption?: string; poster?: string })
  | (Base & {
      kind: "file"
      name: string
      size: string
      fileType: string
    })
  | (Base & {
      kind: "folder"
      name: string
      itemCount: number
      access: "Can view" | "Can edit"
    })
  | (Base & {
      kind: "link"
      image: string
      title: string
      domain: string
      description: string
    })
  | (Base & {
      kind: "booking"
      title: string
      date: string
      timeRange: string
      status: "pending" | "confirmed"
    })
  | (Base & {
      kind: "deal"
      brand: string
      title: string
      budget: string
      deliverables: string[]
      status: "new" | "accepted"
    })
  | (Base & {
      kind: "review"
      creator: string
      campaign: string
      title: string
      assetName: string
      status: "pending" | "approved" | "changes_requested"
    })

export type Conversation = {
  id: string
  name: string
  handle: string
  brandName?: string
  systemRole?: string
  tone: AvatarTone
  type?: "dm" | "community" | "group"
  role?: "admin" | "member"
  channels?: { id: string; name: string; unread?: number; messages?: Message[] }[]
  members?: { id: string; name: string; role: string; tone: AvatarTone }[]
  verified?: boolean
  online?: boolean
  headset?: boolean
  label?: { text: string; tone: "deal" | "pending" | "vip" }
  preview: string
  time: string
  unread?: number
  muted?: boolean
  messages: Message[]
  brandInfo?: {
    description: string
    links: { label: string; url: string }[]
  }
  representative?: {
    name: string
    role: string
  }
}

export const conversations: Conversation[] = [
  {
    id: "glow",
    name: "Glow Beauty Co.",
    handle: "@glowbeauty",
    brandName: "Glow Beauty Co.",
    tone: "pink",
    type: "community",
    role: "admin",
    channels: [
      { 
        id: "general", 
        name: "general",
        messages: [
          { id: "g1", sender: "them", senderName: "Sarah", senderTone: "pink", time: "9:24 AM", kind: "text", text: "Hi! We loved your last skincare reel. We'd like to partner for our Spring launch ✨" },
        ]
      },
      { 
        id: "campaign-briefs", 
        name: "campaign-briefs", 
        unread: 3,
        messages: [
          { id: "g2", sender: "them", senderName: "Sarah", senderTone: "pink", time: "9:25 AM", kind: "deal", brand: "Glow Beauty Co.", title: "Spring Launch — Reel + Story Bundle", budget: "$4,500", deliverables: ["1x Instagram Reel", "3x Stories", "1x Static Post", "Usage rights — 3 months"], status: "new" },
          { id: "g3", sender: "them", senderName: "Sarah", senderTone: "pink", time: "9:26 AM", kind: "folder", name: "Spring Campaign — Brand Kit", itemCount: 18, access: "Can view" },
          { id: "g4", sender: "me", time: "9:31 AM", kind: "text", text: "This looks amazing — count me in! Sharing a couple of references from my last shoot." },
          { id: "g5", sender: "me", time: "9:32 AM", kind: "image", src: "/messages/campaign-shot.png", caption: "Moodboard direction I had in mind" },
          { id: "g6", sender: "me", time: "9:33 AM", kind: "file", name: "Media-Kit-2025.pdf", size: "3.2 MB", fileType: "PDF" },
          { id: "g7", sender: "them", senderName: "Sarah", senderTone: "pink", time: "9:40 AM", kind: "text", text: "Perfect. Here's our brand site so you can match the tone:" },
          { id: "g8", sender: "them", senderName: "Sarah", senderTone: "pink", time: "9:40 AM", kind: "link", image: "/messages/link-preview.png", title: "Glow Beauty — Spring 2025 Collection", domain: "glowbeauty.com", description: "Clean, conscious skincare crafted for radiant everyday glow." },
          { id: "g9", sender: "them", senderName: "Marketing Team", senderTone: "orange", time: "9:42 AM", kind: "booking", title: "Kickoff Call with Brand Team", date: "Thu, Jun 27", timeRange: "3:00 – 3:30 PM", status: "pending" },
        ]
      },
      { 
        id: "content-approval", 
        name: "content-approval",
        messages: []
      }
    ],
    members: [
      { id: "m1", name: "Sarah Jenkins", role: "admin", tone: "pink" },
      { id: "m2", name: "Marketing Team", role: "member", tone: "orange" },
      { id: "m3", name: "System", role: "member", tone: "gray" },
    ],
    verified: true,
    online: true,
    label: { text: "Brand Deal", tone: "deal" },
    preview: "Sent you the campaign brief folder",
    time: "2m",
    unread: 3,
    representative: { name: "Sarah Jenkins", role: "Influencer Manager" },
    brandInfo: {
      description: "Clean, conscious skincare crafted for radiant everyday glow.",
      links: [
        { label: "Website", url: "glowbeauty.com" },
        { label: "Instagram", url: "@glowbeauty" }
      ]
    },
    messages: [],
  },
  {
    id: "nova",
    name: "Nova Studios",
    handle: "@novastudios",
    systemRole: "Editor",
    tone: "blue",
    verified: true,
    label: { text: "VIP", tone: "vip" },
    preview: "Let's lock the shoot date 📸",
    time: "18m",
    unread: 1,
    representative: { name: "Marcus", role: "Lead Producer" },
    messages: [
      { id: "n1", sender: "them", time: "8:10 AM", kind: "text", text: "Morning! Are we still on for the studio shoot this week?" },
      {
        id: "n2",
        sender: "them",
        time: "8:11 AM",
        kind: "booking",
        title: "Studio Shoot — Nova HQ",
        date: "Sat, Jun 29",
        timeRange: "11:00 AM – 4:00 PM",
        status: "confirmed",
      },
    ],
  },
  {
    id: "maya",
    name: "Maya",
    handle: "@maya_creates",
    systemRole: "Content Creator",
    tone: "purple",
    headset: true,
    preview: "Final cut is in the shared folder",
    time: "1h",
    messages: [
      { id: "m1", sender: "them", time: "Yesterday", kind: "text", text: "The edit is done! Dropped everything here:" },
      {
        id: "m2",
        sender: "them",
        time: "Yesterday",
        kind: "folder",
        name: "Vlog Ep.12 — Final Exports",
        itemCount: 6,
        access: "Can edit",
      },
    ],
  },
  {
    id: "fit",
    name: "FitFuel",
    handle: "@fitfuel_official",
    brandName: "FitFuel Nutrition",
    tone: "green",
    label: { text: "Pending", tone: "pending" },
    preview: "Awaiting your contract signature",
    time: "3h",
    brandInfo: {
      description: "Performance nutrition and activewear for the modern athlete.",
      links: [
        { label: "Website", url: "fitfuel.com" }
      ]
    },
    messages: [
      {
        id: "f1",
        sender: "them",
        time: "Mon",
        kind: "file",
        name: "FitFuel-Collab-Agreement.pdf",
        size: "1.1 MB",
        fileType: "PDF",
      },
    ],
  },
  {
    id: "alex",
    name: "Alex",
    handle: "@alex_shotit",
    systemRole: "Videographer",
    tone: "orange",
    online: true,
    preview: "Reacted 🔥 to your message",
    time: "5h",
    muted: true,
    messages: [
      { id: "a1", sender: "them", time: "Mon", kind: "text", text: "That collab idea is 🔥 let's do it" },
    ],
  },
  {
    id: "urban",
    name: "Urban Threads",
    handle: "@urbanthreads",
    brandName: "Urban Threads",
    tone: "gray",
    verified: true,
    preview: "You: Sent the lookbook video",
    time: "1d",
    messages: [
      {
        id: "u1",
        sender: "me",
        time: "Sun",
        kind: "video",
        src: "https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4",
        poster: "/messages/reel-thumb.png",
        duration: "0:42",
        caption: "Here's the lookbook teaser cut",
      },
    ],
  },
  {
    id: "team",
    name: "Creator Squad",
    handle: "5 members",
    tone: "red",
    type: "community",
    role: "member",
    channels: [
      { 
        id: "general", 
        name: "general",
        messages: [
          { id: "t2", sender: "them", senderName: "Alex", senderTone: "blue", time: "Mon", kind: "text", text: "Hey everyone! How's the new project coming along?" },
          { id: "t3", sender: "them", senderName: "Marcus", senderTone: "teal", time: "Mon", kind: "text", text: "Almost done with my part." },
        ]
      },
      { 
        id: "edits", 
        name: "edits",
        messages: []
      },
      { 
        id: "collabs", 
        name: "collabs", 
        unread: 5,
        messages: [
          { id: "t1", sender: "them", senderName: "Priya", senderTone: "purple", time: "Tue", kind: "text", text: "Team — shipping the final assets tonight 🚀" },
          { id: "t4", sender: "them", senderName: "Marcus", senderTone: "teal", time: "Wed", kind: "text", text: "Looks good to me." },
          { id: "t5", sender: "them", senderName: "Sarah", senderTone: "pink", time: "Wed", kind: "text", text: "Can we adjust the lighting on the 2nd cut?" },
          { id: "t6", sender: "them", senderName: "Marcus", senderTone: "teal", time: "Wed", kind: "text", text: "Sure, let me tweak it." },
          { id: "t7", sender: "them", senderName: "Marcus", senderTone: "teal", time: "Wed", kind: "text", text: "Updated, check the folder." },
        ]
      }
    ],
    members: [
      { id: "c1", name: "Priya", role: "admin", tone: "purple" },
      { id: "c2", name: "Marcus", role: "member", tone: "teal" },
      { id: "c3", name: "Sarah", role: "member", tone: "pink" },
      { id: "c4", name: "Alex", role: "member", tone: "blue" },
    ],
    preview: "Priya: shipping the assets tonight",
    time: "2d",
    unread: 5,
    messages: [],
  },
]
