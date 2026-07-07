"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Chip, Tabs, AlertDialog, Button, Dropdown } from "@heroui/react"
import { useProfile, PortfolioItem, PortfolioTab } from "@/context/profile-context"
import { Eye, EyeSlash, Folder, Plus, Pencil, TrashBin } from "@gravity-ui/icons"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ── Sortable Item Wrapper ──────────────────────────────────────────
function SortableMasonryItem({ 
  item, 
  isEditing, 
  onToggleVisibility,
  tabs,
  onMoveToTab
}: { 
  item: PortfolioItem; 
  isEditing?: boolean; 
  onToggleVisibility: (id: string) => void;
  tabs: PortfolioTab[];
  onMoveToTab: (id: string, tabId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id, data: { type: "item" } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  }

  const itemContent = (
    <div 
      className={cn(
        "relative overflow-hidden rounded-[16px] transition-all duration-300",
        isDragging && "scale-[1.03] shadow-xl",
        isEditing && item.isHidden && !isDragging && "opacity-50 grayscale-[50%]"
      )}
    >
      <img 
        src={item.imageUrl} 
        alt={item.title}
        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300"
        loading="lazy"
        draggable={false} 
      />
      
      {item.duration && (
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <Chip
            size="sm"
            className="bg-black/60 backdrop-blur-md border-none h-[22px] text-white font-semibold text-[11px] px-1.5"
          >
            {item.duration}
          </Chip>
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <Dropdown placement="bottom-end">
            <Dropdown.Trigger>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white transition-all hover:bg-black/80 hover:scale-110 touch-none outline-none cursor-pointer"
              >
                <Folder className="h-4 w-4" />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Popover className="min-w-[160px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
              <Dropdown.Menu 
                onAction={(key) => onMoveToTab(item.id, key.toString())}
                className="p-1"
              >
                {tabs.map((tab) => (
                  <Dropdown.Item 
                    id={tab.id} 
                    key={tab.id}
                    className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white"
                  >
                    {tab.label} {item.tabId === tab.id ? "(Current)" : ""}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(item.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white transition-all hover:bg-black/80 hover:scale-110 touch-none outline-none"
          >
            {item.isHidden ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  )

  if (isEditing) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes}
        {...listeners}
        className="w-full break-inside-avoid overflow-hidden mb-4 cursor-grab active:cursor-grabbing touch-none group"
      >
        {itemContent}
      </div>
    )
  }

  return (
    <div className="w-full break-inside-avoid overflow-hidden cursor-pointer mb-4 group">
      {itemContent}
    </div>
  )
}

// ── Inline Editable Tab ──────────────────────────────────────────
function EditableTab({ 
  tab, 
  isEditingName,
  onCommitName,
  onStartEdit,
  onDelete
}: { 
  tab: PortfolioTab; 
  isEditingName: boolean;
  onCommitName: (id: string, newName: string) => void;
  onStartEdit: () => void;
  onDelete: () => void;
}) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isEditingName && spanRef.current) {
      spanRef.current.focus()
      // Move cursor to the end
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(spanRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditingName])

  const handleBlur = () => {
    if (isEditingName && spanRef.current) {
      onCommitName(tab.id, spanRef.current.textContent || "")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      spanRef.current?.blur()
    }
  }

  return (
    <div className="flex items-center gap-1.5 group">
      <span
        ref={spanRef}
        contentEditable={isEditingName}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPointerDown={(e) => isEditingName && e.stopPropagation()} // Prevent drag/tab switch while typing
        onClick={(e) => isEditingName && e.stopPropagation()}
        className={cn(
          "outline-none min-w-[20px] transition-colors",
          isEditingName && "border-b-2 border-black dark:border-white px-1 text-black dark:text-white"
        )}
      >
        {tab.label}
      </span>
      
      {!isEditingName && (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onStartEdit(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-black dark:hover:text-white"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}

      {!isEditingName && (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500"
        >
          <TrashBin className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ── Sortable Tab Wrapper ──────────────────────────────────────────
function SortableTab({ 
  tab, 
  isEditingMode,
  isEditingName,
  onCommitName,
  onStartEdit,
  onDelete
}: { 
  tab: PortfolioTab; 
  isEditingMode: boolean;
  isEditingName: boolean;
  onCommitName: (id: string, newName: string) => void;
  onStartEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id, data: { type: "tab" } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1
  }

  return (
    <Tabs.Tab 
      id={tab.id} 
      className={cn(
        "w-auto px-0 text-gray-500 data-[selected=true]:text-black dark:data-[selected=true]:text-white font-semibold text-[16px] tracking-tight outline-none relative group",
        isEditingMode && !isEditingName && "cursor-grab active:cursor-grabbing touch-none"
      )}
    >
      <div 
        ref={isEditingMode ? setNodeRef : undefined}
        style={style}
        {...(isEditingMode && !isEditingName ? attributes : {})}
        {...(isEditingMode && !isEditingName ? listeners : {})}
      >
        {isEditingMode ? (
          <EditableTab 
            tab={tab}
            isEditingName={isEditingName}
            onCommitName={onCommitName}
            onStartEdit={onStartEdit}
            onDelete={onDelete}
          />
        ) : (
          <span>{tab.label}</span>
        )}
      </div>
      <Tabs.Indicator className="bg-black dark:bg-white h-0.5 rounded-full" />
    </Tabs.Tab>
  )
}

// ── Main Section ──────────────────────────────────────────────────
export function PortfolioSection({ 
  isEditing = false,
  onChange
}: { 
  isEditing?: boolean
  onChange?: (items: PortfolioItem[]) => void
}) {
  const { profile, setProfile } = useProfile()
  
  const [activeTabId, setActiveTabId] = useState<string>("all")
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  // Inline Editing State
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [draftTab, setDraftTab] = useState<PortfolioTab | null>(null)

  useEffect(() => {
    if (isEditing) {
      const hasSeen = localStorage.getItem("creonity_portfolio_tutorial")
      if (!hasSeen) {
        setShowTutorial(true)
      }
    } else {
      setEditingTabId(null)
      setDraftTab(null)
    }
  }, [isEditing])

  const handleDismissTutorial = () => {
    if (dontShowAgain) {
      localStorage.setItem("creonity_portfolio_tutorial", "true")
    }
    setShowTutorial(false)
  }
  
  const portfolioTabs = useMemo(() => {
    const tabs = [...profile.portfolioTabs].sort((a,b) => a.order - b.order)
    if (draftTab) tabs.push(draftTab)
    return tabs
  }, [profile.portfolioTabs, draftTab])

  const allItems = [...profile.portfolioItems].sort((a, b) => a.order - b.order)
  
  const displayItems = useMemo(() => {
    let items = allItems
    if (activeTabId !== "all") {
      items = items.filter(item => item.tabId === activeTabId)
    }
    return isEditing ? items : items.filter(item => !item.isHidden)
  }, [allItems, activeTabId, isEditing])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    if (active.data.current?.type === "tab") {
      // Don't reorder if dragging draft tab
      if (active.id === draftTab?.id || over.id === draftTab?.id) return
      
      const oldIndex = profile.portfolioTabs.findIndex((t) => t.id === active.id)
      const newIndex = profile.portfolioTabs.findIndex((t) => t.id === over.id)
      const newTabs = arrayMove(profile.portfolioTabs, oldIndex, newIndex).map((t, idx) => ({ ...t, order: idx }))
      setProfile(prev => ({ ...prev, portfolioTabs: newTabs }))
    } else if (active.data.current?.type === "item") {
      if (!onChange) return
      const oldIndex = allItems.findIndex((i) => i.id === active.id)
      const newIndex = allItems.findIndex((i) => i.id === over.id)
      onChange(arrayMove(allItems, oldIndex, newIndex).map((item, idx) => ({ ...item, order: idx })))
    }
  }

  const handleToggleVisibility = (id: string) => {
    if (!onChange) return
    onChange(allItems.map(i => i.id === id ? { ...i, isHidden: !i.isHidden } : i))
  }

  const handleMoveToTab = (id: string, tabId: string) => {
    if (!onChange) return
    onChange(allItems.map(i => i.id === id ? { ...i, tabId } : i))
  }

  const handleAddDraftTab = () => {
    const newId = `t-${Date.now()}`
    const newTab = { id: newId, label: "", order: profile.portfolioTabs.length }
    setDraftTab(newTab)
    setEditingTabId(newId)
    setActiveTabId(newId) // Optionally switch to it immediately
  }

  const handleCommitTabName = (id: string, newName: string) => {
    const cleanName = newName.trim()
    
    if (draftTab?.id === id) {
      if (!cleanName) {
        // Cancel draft
        setDraftTab(null)
        setEditingTabId(null)
        setActiveTabId("all") // Revert active tab
        return
      }
      // Save draft as real tab
      setProfile(prev => ({
        ...prev,
        portfolioTabs: [...prev.portfolioTabs, { ...draftTab, label: cleanName }]
      }))
      setDraftTab(null)
      setEditingTabId(null)
      toast.success("Tab added successfully")
    } else {
      // Editing existing tab
      if (!cleanName) {
        // Just revert to old name if empty, or you could delete it
        setEditingTabId(null)
        return
      }
      setProfile(prev => ({
        ...prev,
        portfolioTabs: prev.portfolioTabs.map(t => t.id === id ? { ...t, label: cleanName } : t)
      }))
      setEditingTabId(null)
      toast.success("Tab renamed")
    }
  }

  const handleDeleteTab = (id: string) => {
    setProfile(prev => ({
      ...prev,
      portfolioTabs: prev.portfolioTabs.filter(t => t.id !== id)
    }))
    if (activeTabId === id) {
      setActiveTabId("all")
    }
    toast.success("Tab deleted")
  }

  return (
    <div className="flex flex-col w-full h-full pb-10 pt-0 px-4 lg:px-0">
      
      {/* Tutorial Dialog */}
      <AlertDialog open={showTutorial} onOpenChange={setShowTutorial}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Heading>Organize your portfolio</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-gray-600 dark:text-gray-300 text-[14px]">
                  Drag any post to reorder it within the grid. Click the folder icon to move a post to a different tab, or the eye icon to hide it.
                  You can also drag the tabs themselves to reorder them!
                </p>
                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={dontShowAgain} 
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black dark:border-white/20 dark:bg-black"
                  />
                  <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Don't show this again</span>
                </label>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="solid" className="bg-black text-white dark:bg-white dark:text-black w-full" onPress={handleDismissTutorial}>
                  Got it
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Tabs 
          className="w-full !border-none" 
          variant="secondary"
          selectedKey={activeTabId}
          onSelectionChange={(k) => {
            if (k.toString() === "add-tab") {
              handleAddDraftTab()
            } else {
              setActiveTabId(k.toString())
            }
          }}
        >
          <Tabs.ListContainer className="w-full overflow-x-auto no-scrollbar scroll-smooth !border-none !border-b-transparent !shadow-none">
            {/* Reduced gap from gap-10 to gap-6 (or gap-8) for closer tabs */}
            <Tabs.List aria-label="Portfolio Categories" className="flex justify-start gap-8 flex-nowrap whitespace-nowrap w-max !border-none !border-b-transparent !shadow-none pr-6">
              
              <Tabs.Tab id="all" className="w-auto px-0 text-gray-500 data-[selected=true]:text-black dark:data-[selected=true]:text-white font-semibold text-[16px] tracking-tight outline-none">
                All Work
                <Tabs.Indicator className="bg-black dark:bg-white h-0.5 rounded-full" />
              </Tabs.Tab>

              <SortableContext items={portfolioTabs.map(t => t.id)} strategy={horizontalListSortingStrategy}>
                {portfolioTabs.map(tab => (
                  <SortableTab 
                    key={tab.id} 
                    tab={tab} 
                    isEditingMode={isEditing}
                    isEditingName={editingTabId === tab.id}
                    onStartEdit={() => setEditingTabId(tab.id)}
                    onCommitName={handleCommitTabName}
                    onDelete={() => handleDeleteTab(tab.id)}
                  />
                ))}
              </SortableContext>

              {isEditing && !draftTab && (
                <Tabs.Tab id="add-tab" className="w-auto px-0 text-gray-400 hover:text-black dark:hover:text-white font-semibold text-[15px] tracking-tight outline-none transition-colors group">
                  <div className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>New Tab</span>
                  </div>
                </Tabs.Tab>
              )}

            </Tabs.List>
          </Tabs.ListContainer>

          {["all", ...portfolioTabs.map(t => t.id)].map(tabId => (
            <Tabs.Panel key={tabId} id={tabId} className="!p-0">
              <div className="pt-6">
                <SortableContext items={displayItems.map((i) => i.id)} strategy={rectSortingStrategy}>
                  <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
                    {displayItems.map((item) => (
                      <SortableMasonryItem
                        key={item.id}
                        item={item}
                        isEditing={isEditing}
                        onToggleVisibility={handleToggleVisibility}
                        tabs={profile.portfolioTabs}
                        onMoveToTab={handleMoveToTab}
                      />
                    ))}
                  </div>
                </SortableContext>
                
                {displayItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="text-[14px] font-medium text-gray-500">No posts here</div>
                    <div className="text-[12px] text-gray-400">Posts assigned to this tab will appear here</div>
                  </div>
                )}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </DndContext>
    </div>
  )
}
