"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Button, ScrollShadow } from "@heroui/react"
import { HardDrive, Picture, Video, FileText, Headphones } from "@gravity-ui/icons"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  SettingsPage,
  SettingsSection,
  SettingsCard,
} from "../settings-ui"

const storageData = [
  {
    name: "Storage",
    Images: 7.1,
    Videos: 4.3,
    Documents: 2.1,
    Audio: 1.7,
    Free: 34.8,
  },
];

const UPGRADE_OPTIONS = [
  { id: "100gb", size: "100 GB", price: "$1.99" },
  { id: "200gb", size: "200 GB", price: "$2.99" },
  { id: "400gb", size: "400 GB", price: "$4.99", popular: true },
  { id: "2tb", size: "2 TB", price: "$9.99" },
  { id: "5tb", size: "5 TB", price: "$24.99" },
  { id: "10tb", size: "10 TB", price: "$49.99" },
  { id: "20tb", size: "20 TB", price: "$99.99" },
  { id: "30tb", size: "30 TB", price: "$149.99" },
  { id: "50tb", size: "50 TB", price: "$249.99" },
];

const LeftRoundedBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  if (!width) return null;
  return (
    <path 
      d={`M ${x + width} ${y} L ${x + 10} ${y} A 10 10 0 0 0 ${x} ${y + 10} L ${x} ${y + height - 10} A 10 10 0 0 0 ${x + 10} ${y + height} L ${x + width} ${y + height} Z`} 
      fill={fill} 
    />
  );
};

const RightRoundedBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  if (!width) return null;
  return (
    <path 
      d={`M ${x} ${y} L ${x + width - 10} ${y} A 10 10 0 0 1 ${x + width} ${y + 10} L ${x + width} ${y + height - 10} A 10 10 0 0 1 ${x + width - 10} ${y + height} L ${x} ${y + height} Z`} 
      fill={fill} 
      className="dark:fill-[#27272a]"
    />
  );
};

export function StorageView({ onBack }: { onBack?: () => void }) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = activeHover ? payload.find((p: any) => p.dataKey === activeHover) : null;
      if (!entry) return null;

      return (
        <div className="bg-white dark:bg-[#111111] border border-[#e4e4e7] dark:border-[#27272a] shadow-lg rounded-xl p-3 flex items-center justify-between gap-6 min-w-[150px]">
          <div className="flex items-center gap-2 text-[13px]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#52525b] dark:text-[#a1a1aa] font-medium">{entry.name}</span>
          </div>
          <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{entry.value} GB</span>
        </div>
      );
    }
    return null;
  };

  return (
    <SettingsPage title="Storage" onBack={onBack}>
      
      {/* Account Storage Section */}
      <SettingsSection>
        <SettingsCard className="flex flex-col p-6 overflow-visible gap-6">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#52525b] dark:text-[#a1a1aa]" />
              Account Storage
            </span>
            <span className="text-[14px] font-medium text-[#52525b] dark:text-[#a1a1aa]">
              15.2 GB of 50 GB used
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="h-6 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={storageData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barSize={40}>
                  <XAxis type="number" hide domain={[0, 50]} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip cursor={false} content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} allowEscapeViewBox={{ x: true, y: true }} />
                  <Bar dataKey="Images" stackId="a" fill="#339CFF" isAnimationActive={false} shape={<LeftRoundedBar />} onMouseEnter={() => setActiveHover('Images')} />
                  <Bar dataKey="Videos" stackId="a" fill="#8B5CF6" isAnimationActive={false} onMouseEnter={() => setActiveHover('Videos')} />
                  <Bar dataKey="Documents" stackId="a" fill="#10B981" isAnimationActive={false} onMouseEnter={() => setActiveHover('Documents')} />
                  <Bar dataKey="Audio" stackId="a" fill="#F59E0B" isAnimationActive={false} onMouseEnter={() => setActiveHover('Audio')} />
                  <Bar dataKey="Free" stackId="a" fill="#e4e4e7" isAnimationActive={false} shape={<RightRoundedBar />} onMouseEnter={() => setActiveHover('Free')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#339CFF]" />
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">Images</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">Videos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">Documents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">Audio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e4e4e7] dark:bg-[#3f3f46]" />
                <span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">Free</span>
              </div>
            </div>
          </div>
          
          <Button onClick={() => setIsUpgradeModalOpen(true)} className="font-medium bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] px-5 w-fit rounded-full">
            Get more storage
          </Button>
        </SettingsCard>
      </SettingsSection>

      {/* Manage Storage Section */}
      <SettingsSection title="Manage Storage">
        <SettingsCard className="flex flex-col p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 text-[#339CFF] flex items-center justify-center shrink-0">
                <Picture className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Images</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">7.1 GB</span>
              </div>
            </div>
            <Button onClick={() => toast.success("Storage optimized")} size="sm" variant="bordered" className="border-[#e4e4e7] dark:border-[#27272a] font-medium text-[#0a0a0a] dark:text-white">Manage</Button>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 text-[#8B5CF6] flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Videos</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">4.3 GB</span>
              </div>
            </div>
            <Button onClick={() => toast.success("Storage optimized")} size="sm" variant="bordered" className="border-[#e4e4e7] dark:border-[#27272a] font-medium text-[#0a0a0a] dark:text-white">Manage</Button>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 text-[#10B981] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Documents</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">2.1 GB</span>
              </div>
            </div>
            <Button onClick={() => toast.success("Storage optimized")} size="sm" variant="bordered" className="border-[#e4e4e7] dark:border-[#27272a] font-medium text-[#0a0a0a] dark:text-white">Manage</Button>
          </div>
          <div className="flex items-center justify-between px-6 h-[72px] border-b border-[#f4f4f5] dark:border-[#1f1f1f] last:border-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 text-[#F59E0B] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">Audio</span>
                <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">1.7 GB</span>
              </div>
            </div>
            <Button onClick={() => toast.success("Storage optimized")} size="sm" variant="bordered" className="border-[#e4e4e7] dark:border-[#27272a] font-medium text-[#0a0a0a] dark:text-white">Manage</Button>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Upgrade Storage Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111111] rounded-[24px] p-7 w-full max-w-lg relative animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <button onClick={() => setIsUpgradeModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
              <Icon icon="gravity-ui:xmark" className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white">Upgrade Storage</h3>
              <p className="text-[14px] text-[#52525b] dark:text-[#a1a1aa]">Choose a plan that fits your growing portfolio.</p>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Current Plan */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Current Plan</h4>
                <div className="flex items-center justify-between p-4 rounded-[16px] border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#18181b]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">50 GB</span>
                    <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Included in Go Plan</span>
                  </div>
                </div>
              </div>

              {/* Available Plans */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Available Upgrades</h4>
                
                <ScrollShadow hideScrollBar className="flex flex-col gap-3 max-h-[260px] pb-2">
                  {UPGRADE_OPTIONS.map((option) => (
                    <div key={option.id} className={`flex items-center justify-between p-4 rounded-[16px] border ${option.popular ? 'border-[#8B5CF6] dark:border-[#8B5CF6]' : 'border-[#e4e4e7] dark:border-[#27272a] hover:border-[#0a0a0a] dark:hover:border-white'} transition-colors cursor-pointer group relative overflow-hidden shrink-0`}>
                      {option.popular && (
                        <div className="absolute top-0 right-0 bg-[#8B5CF6] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{option.size}</span>
                        <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Total Space</span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">{option.price}<span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">/mo</span></span>
                      </div>
                    </div>
                  ))}

                  {/* Pay as you go */}
                  <div className="flex items-center justify-between p-4 rounded-[16px] border border-[#e4e4e7] dark:border-[#27272a] hover:border-[#339CFF] dark:hover:border-[#339CFF] transition-colors cursor-pointer group shrink-0 mt-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Pay as you go</span>
                      <span className="text-[13px] text-[#52525b] dark:text-[#a1a1aa]">Scale unlimitedly</span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">$0.05<span className="text-[13px] font-medium text-[#52525b] dark:text-[#a1a1aa]">/GB</span></span>
                    </div>
                  </div>
                </ScrollShadow>
              </div>

            </div>
          </div>
        </div>
      )}
    </SettingsPage>
  )
}
