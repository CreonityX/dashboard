"use client"

import { useState } from "react"
import { Button } from "@heroui/react"
import { Xmark, Check, Lock, LockOpen } from "@gravity-ui/icons"
import { useAccount } from "@/context/account-context"
import { GradientAvatar } from "@/components/messages/gradient-avatar"

type Props = {
  communityId: string
  onClose: () => void
}

const inputClass = "h-11 w-full rounded-xl border-none bg-[#f4f4f5] px-4 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] focus:ring-2 focus:ring-[#0a0a0a]/10 dark:bg-[#1f1f1f] dark:text-white dark:focus:ring-white/10 transition-all"

export function CreateChannelModal({ communityId, onClose }: Props) {
  const { brandConversations, createBrandChannel } = useAccount()
  const community = brandConversations.find(c => c.id === communityId)
  
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const members = community?.members || []

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(prev => prev.filter(m => m !== id))
    } else {
      setSelectedMembers(prev => [...prev, id])
    }
  }

  const handleCreate = () => {
    createBrandChannel(communityId, name.replace(/\s+/g, '-').toLowerCase(), {
      private: isPrivate,
      members: isPrivate ? selectedMembers : []
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all" onClick={onClose}>
      <div 
        className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl dark:bg-[#18181b] border border-[#efefef] dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">Create a Channel</h2>
            <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Step {step} of 2</p>
          </div>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors"
          >
            <Xmark className="h-5 w-5 text-[#a1a1aa]" />
          </button>
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-4 mt-6">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Name</label>
              <input 
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                placeholder="e.g. announcements"
                className={inputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) setStep(2)
                }}
              />
              <p className="mt-2 text-[12px] text-[#737373] dark:text-[#a1a1aa]">
                Channels are where your team communicates. They're best when organized around a topic.
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                isDisabled={!name.trim()}
                onPress={() => setStep(2)}
                className="rounded-xl bg-[#0a0a0a] px-5 py-2 text-[14px] font-semibold text-white dark:bg-white dark:text-[#0a0a0a]"
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-6">
            <button 
              onClick={() => setIsPrivate(!isPrivate)} 
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${isPrivate ? "border-[#0a0a0a] bg-[#fafafa] dark:border-white dark:bg-[#27272a]" : "border-[#efefef] dark:border-white/10 hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f]"}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPrivate ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]" : "bg-[#f4f4f5] dark:bg-[#27272a] text-[#737373] dark:text-[#a1a1aa]"}`}>
                {isPrivate ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
              </div>
              <div>
                <span className={`block text-[14px] font-semibold ${isPrivate ? "text-[#0a0a0a] dark:text-white" : "text-[#0a0a0a] dark:text-white"}`}>Make channel private</span>
                <span className="block text-[12px] text-[#737373] dark:text-[#a1a1aa]">When a channel is private, it can only be viewed or joined by invitation.</span>
              </div>
            </button>

            {isPrivate && members.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Select Members</label>
                <div className="max-h-[160px] overflow-y-auto rounded-xl border border-[#efefef] dark:border-white/10 p-2">
                  {members.map((m: any) => {
                    const selected = selectedMembers.includes(m.id)
                    return (
                      <button 
                        key={m.id}
                        onClick={() => toggleMember(m.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-[#27272a]"
                      >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a]" : "border-[#d4d4d8] dark:border-[#3f3f46] text-transparent"}`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <GradientAvatar tone={m.tone} className="h-7 w-7 shrink-0" />
                        <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{m.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <Button 
                variant="light"
                onPress={() => setStep(1)}
                className="rounded-xl px-5 py-2 text-[14px] font-semibold text-[#0a0a0a] dark:text-white"
              >
                Back
              </Button>
              <Button 
                onPress={handleCreate}
                className="rounded-xl bg-[#0a0a0a] px-5 py-2 text-[14px] font-semibold text-white dark:bg-white dark:text-[#0a0a0a]"
              >
                Create
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
