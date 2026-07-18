"use client"

import { useId, useState, type KeyboardEvent, type ReactNode } from "react"
import { ChevronDown, Globe, Link, MapPin, Plus, Xmark, Pencil } from "@gravity-ui/icons"
import type { Experience, Organization, ProfileData } from "@/context/profile-context"
import { cn } from "@/lib/utils"
import { AlertDialog, Button, Switch } from "@heroui/react"
import { toast } from "@heroui/react"
import { BrandLogo } from "@/components/ui/brand-logo"

const creatorTypes = [
  "Independent Designer",
  "Content Creator",
  "Photographer",
  "Filmmaker",
  "Creative Director",
  "UGC Creator",
]

const locations = [
  "New York City, NY",
  "Los Angeles, CA",
  "London, UK",
  "Mumbai, India",
  "Bengaluru, India",
  "Berlin, Germany",
]

const organizations: Organization[] = [
  { id: "good-day-studio", name: "Good Day Studio™", type: "Design Agency" },
  { id: "studio-else", name: "Studio Else", type: "Creative Studio" },
  { id: "north-house", name: "North House", type: "Creator Collective" },
  { id: "daybreak", name: "Daybreak", type: "Production Studio" },
]

const brands = [
  { id: "notion", name: "Notion", domain: "notion.so" },
  { id: "wise", name: "Wise", domain: "wise.com" },
  { id: "uber", name: "Uber", domain: "uber.com" },
  { id: "glossier", name: "Glossier", domain: "glossier.com" },
  { id: "nike", name: "Nike", domain: "nike.com" },
  { id: "airbnb", name: "Airbnb", domain: "airbnb.com" },
]

const fieldClass = "h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3.5 text-[14px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-white/10 dark:bg-transparent dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300">{label}</div>
      {children}
    </div>
  )
}

function AutocompleteField({
  label,
  value,
  options,
  placeholder,
  icon,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  icon?: ReactNode
  onChange: (value: string) => void
}) {
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const filtered = options.filter((option) => option.toLowerCase().includes(value.toLowerCase())).slice(0, 5)

  return (
    <Field label={label}>
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          value={value}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          onChange={(event) => {
            onChange(event.target.value)
            setIsOpen(true)
          }}
          className={cn(fieldClass, icon && "pl-10", "pr-9")}
        />
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {isOpen && filtered.length > 0 && (
          <div id={listId} role="listbox" className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#171717]">
            {filtered.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                key={option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  )
}

function TagsField({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("")

  const addTag = () => {
    const value = draft.trim().replace(/,$/, "")
    if (value && !tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) onChange([...tags, value])
    setDraft("")
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addTag()
    } else if (event.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <Field label="Tags">
      <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-xl bg-transparent py-1.5 transition">
        {tags.map((tag) => (
          <span key={tag} className="flex h-7 items-center gap-1.5 rounded-full bg-gray-100 px-3 text-[13px] font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag))} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <Xmark className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          placeholder={tags.length ? "Add another" : "Type a tag and press Enter"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addTag}
          className="h-8 min-w-[150px] flex-1 rounded-lg bg-transparent px-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-500 hover:bg-gray-50 focus:bg-gray-50 dark:text-white dark:hover:bg-white/5 dark:focus:bg-white/5"
        />
      </div>
    </Field>
  )
}

function OrganizationSearch({ value, onChange }: { value?: Organization; onChange: (value?: Organization) => void }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const filtered = organizations.filter((organization) => organization.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Field label="Agency / Team">
      {value && !isOpen ? (
        <div className="group flex min-h-[58px] w-full items-center gap-4 py-2 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#ff7a00] via-[#ff004d] to-[#8000ff]" />
          <button type="button" onClick={() => setIsOpen(true)} className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{value.name}</span>
            <span className="mt-0.5 block text-[13px] text-gray-500">{value.type}</span>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <AlertDialog>
              <AlertDialog.Trigger className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white outline-none">
                <Xmark className="h-5 w-5" />
              </AlertDialog.Trigger>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                    {(renderProps: any) => (
                      <>
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                          <AlertDialog.Icon status="danger" />
                          <AlertDialog.Heading className="text-[#0a0a0a] dark:text-white">Remove agency?</AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                          <p className="text-gray-600 dark:text-gray-300">Are you sure you want to remove {value.name} from your profile?</p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                          <Button slot="close" variant="tertiary" className="!text-[#0a0a0a] dark:!text-white font-medium">Cancel</Button>
                          <Button variant="danger" onPress={() => { onChange(undefined); toast.error("Agency removed"); renderProps.close(); }}>Remove</Button>
                        </AlertDialog.Footer>
                      </>
                    )}
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
            <button type="button" onClick={() => setIsOpen(true)} aria-label={`Edit ${value.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"><Pencil className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input autoFocus={isOpen} value={query} placeholder="Search agencies or teams" onFocus={() => setIsOpen(true)} onBlur={() => window.setTimeout(() => setIsOpen(false), 120)} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl bg-transparent pl-10 pr-3.5 text-[14px] text-gray-900 outline-none transition placeholder:text-gray-500 hover:bg-gray-50 focus:bg-gray-50 dark:text-white dark:placeholder:text-gray-400 dark:hover:bg-white/5 dark:focus:bg-white/5" />
          <Plus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          {isOpen && filtered.length > 0 && (
            <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#171717]">
              {filtered.map((organization) => (
                <button type="button" key={organization.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(organization); toast.success("Agency added"); setQuery(""); setIsOpen(false) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10">
                  <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#ff7a00] via-[#ff004d] to-[#8000ff]" />
                  <span><span className="block text-[13px] font-medium">{organization.name}</span><span className="block text-[11px] text-gray-400">{organization.type}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Field>
  )
}

function BrandCollaborationsEditor({ experience, onChange }: { experience: Experience[]; onChange: (experience: Experience[]) => void }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const selectedNames = new Set(experience.map((item) => item.company.toLowerCase()))
  const filtered = brands.filter((brand) => !selectedNames.has(brand.name.toLowerCase()) && brand.name.toLowerCase().includes(query.toLowerCase()))

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(experience.map((item) => item.id === id ? { ...item, ...updates } : item))
  }

  const addWorkLink = (item: Experience) => {
    const workLinks = [...(item.workLinks ?? []), { id: `work-${Date.now()}`, title: "", url: "" }]
    updateExperience(item.id, { workLinks })
  }

  return (
    <Field label="Worked with">
      <div className="mb-3 flex flex-col">
        {experience.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="group flex min-h-[58px] w-full items-center gap-4 py-2 text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                {item.domain ? <BrandLogo domain={item.domain} name={item.company ?? ""} className="h-full w-full object-contain" /> : <span className="text-[15px] font-semibold">{item.company.charAt(0)}</span>}
              </div>
              <button type="button" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{item.company}</span>
                <span className="mt-0.5 block text-[13px] text-gray-500">{item.workLinks?.length ? `${item.workLinks.length} featured work ${item.workLinks.length === 1 ? "link" : "links"}` : "Add collaboration details"}</span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <AlertDialog>
                  <AlertDialog.Trigger className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white outline-none">
                    <Xmark className="h-4 w-4" />
                  </AlertDialog.Trigger>
                  <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                      <AlertDialog.Dialog className="sm:max-w-[400px]">
                        {(renderProps: any) => (
                          <>
                            <AlertDialog.CloseTrigger />
                            <AlertDialog.Header>
                              <AlertDialog.Icon status="danger" />
                              <AlertDialog.Heading className="text-[#0a0a0a] dark:text-white">Remove brand collaboration?</AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                              <p className="text-gray-600 dark:text-gray-300">Are you sure you want to remove your collaboration with {item.company}?</p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                              <Button slot="close" variant="tertiary" className="!text-[#0a0a0a] dark:!text-white font-medium">Cancel</Button>
                              <Button variant="danger" onPress={() => { onChange(experience.filter((entry) => entry.id !== item.id)); toast.error("Brand removed"); renderProps.close(); }}>Remove</Button>
                            </AlertDialog.Footer>
                          </>
                        )}
                      </AlertDialog.Dialog>
                    </AlertDialog.Container>
                  </AlertDialog.Backdrop>
                </AlertDialog>
                <button type="button" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"><ChevronDown className={cn("h-5 w-5 transition-transform duration-300", expandedId === item.id && "rotate-180")} /></button>
              </div>
            </div>

            {expandedId === item.id && (
              <div className="relative animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
                {/* Timeline Vertical Line */}
                <div className="absolute left-[23px] top-0 bottom-4 w-[2px] bg-gray-200 dark:bg-gray-800" />
                
                <div className="pl-12 pb-6 flex flex-col gap-5">
                  <div className="relative">
                    <label className="mb-2 block text-[12px] font-medium text-gray-500">Collaboration description</label>
                    <textarea
                      value={item.description ?? ""}
                      rows={3}
                      placeholder="What did you create with this brand?"
                      onChange={(event) => updateExperience(item.id, { description: event.target.value })}
                      className="min-h-[72px] w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-white/10 dark:bg-transparent dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-gray-500">Featured work links</span>
                      <button type="button" onClick={() => addWorkLink(item)} className="flex items-center gap-1 text-[12px] font-medium text-[#0060ff] hover:text-[#0050d0] transition-colors"><Plus className="h-3.5 w-3.5" /> Add link</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {(item.workLinks ?? []).map((workLink) => (
                        <div key={workLink.id} className="relative flex items-start pt-1">
                          {/* Timeline Circle */}
                          <div className="absolute -left-[29px] top-5 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-[2px] border-gray-300 bg-white dark:border-gray-600 dark:bg-[#0a0a0a]" />
                          
                          <div className="flex w-full flex-col gap-3 rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 transition focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 dark:border-white/10 dark:bg-transparent dark:text-white dark:focus-within:border-white/30 dark:focus-within:ring-white/10">
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4 shrink-0 text-gray-400" />
                              <input
                                value={workLink.title}
                                aria-label="Work title"
                                placeholder="Work title"
                                onChange={(event) => updateExperience(item.id, { workLinks: item.workLinks?.map((link) => link.id === workLink.id ? { ...link, title: event.target.value } : link) })}
                                className="min-w-0 flex-1 bg-transparent text-[13.5px] font-semibold text-[#0a0a0a] outline-none placeholder:text-gray-400 dark:text-white"
                              />
                              <button type="button" aria-label="Remove work link" onClick={() => updateExperience(item.id, { workLinks: item.workLinks?.filter((link) => link.id !== workLink.id) })} className="rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"><Xmark className="h-4 w-4" /></button>
                            </div>
                            <input
                              type="url"
                              value={workLink.url}
                              aria-label="Work URL"
                              placeholder="https://instagram.com/p/..."
                              onChange={(event) => updateExperience(item.id, { workLinks: item.workLinks?.map((link) => link.id === workLink.id ? { ...link, url: event.target.value } : link) })}
                              className="w-full bg-transparent pl-6 text-[13px] text-gray-500 outline-none placeholder:text-gray-400 dark:text-gray-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <input value={query} placeholder="Add a brand" onFocus={() => setIsOpen(true)} onBlur={() => window.setTimeout(() => setIsOpen(false), 120)} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl bg-transparent pl-10 pr-3.5 text-[14px] text-gray-900 outline-none transition placeholder:text-gray-500 hover:bg-gray-50 focus:bg-gray-50 dark:text-white dark:placeholder:text-gray-400 dark:hover:bg-white/5 dark:focus:bg-white/5" />
        <Plus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {isOpen && filtered.length > 0 && (
          <div className="absolute z-30 mt-1.5 w-full rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-[#171717]">
            {filtered.map((brand) => (
              <button type="button" key={brand.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange([...experience, { id: brand.id, role: "Brand collaboration", company: brand.name, domain: brand.domain, startDate: "", endDate: "", description: "", workLinks: [{ id: `${brand.id}-work`, title: "", url: "" }] }]); setExpandedId(brand.id); toast.success("Brand collaboration added"); setQuery(""); setIsOpen(false) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-white/10">
                <BrandLogo domain={brand.domain} name={brand.name ?? ""} className="h-7 w-7 rounded-md" />
                <span className="text-[13px] font-medium">{brand.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  )
}

export function ProfileEditorForm({ value, onChange, onSubmit }: { value: ProfileData; onChange: (value: ProfileData) => void; onSubmit?: () => void }) {
  return (
    <form className="flex flex-col gap-4 px-6 pb-10 pt-5" onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}>
      <Field label="Name">
        <input value={value.name} placeholder="Your name" onChange={(event) => onChange({ ...value, name: event.target.value })} className={fieldClass} />
      </Field>

      <AutocompleteField label="Creator type" value={value.tagline} options={creatorTypes} placeholder="Choose a creator type" onChange={(tagline) => onChange({ ...value, tagline })} />

      <Field label="Bio">
        <div className="relative">
          <textarea value={value.about} maxLength={150} rows={3} placeholder="Tell people a little about your work" onChange={(event) => onChange({ ...value, about: event.target.value })} className="min-h-[88px] w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 pb-7 text-[14px] leading-5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-white/10 dark:bg-transparent dark:text-white dark:focus:border-white/30 dark:focus:ring-white/10" />
          <span className="absolute bottom-2.5 right-3.5 text-[11px] font-medium text-gray-400">{value.about.length} / 150</span>
        </div>
      </Field>

      <AutocompleteField label="Location" value={value.location} options={locations} placeholder="Search for a city" icon={<MapPin className="h-4 w-4" />} onChange={(location) => onChange({ ...value, location })} />

      <Field label="Website">
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="url" value={value.website} placeholder="yourwebsite.com" onChange={(event) => onChange({ ...value, website: event.target.value })} className={cn(fieldClass, "pl-10")} />
        </div>
      </Field>

      <TagsField tags={value.skills} onChange={(skills) => onChange({ ...value, skills })} />
      <OrganizationSearch value={value.agency} onChange={(agency) => onChange({ ...value, agency })} />
      <BrandCollaborationsEditor experience={value.experience} onChange={(experience) => onChange({ ...value, experience })} />
      
      <div className="mt-6 flex flex-col gap-4">
        <div className="mb-1.5 text-[14px] font-semibold text-gray-900 dark:text-white">Privacy & Settings</div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-900 dark:text-white">Public profile</span>
            <span className="text-[12px] text-gray-500">Allow anyone to view your profile</span>
          </div>
          <Switch 
            size="sm" 
            isSelected={value.isPublicProfile} 
            onChange={(val) => onChange({ ...value, isPublicProfile: val })}
            aria-label="Public profile"
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-900 dark:text-white">Search engine indexing</span>
            <span className="text-[12px] text-gray-500">Allow search engines to show your profile</span>
          </div>
          <Switch 
            size="sm" 
            isSelected={value.searchEngineIndexing} 
            onChange={(val) => onChange({ ...value, searchEngineIndexing: val })}
            aria-label="Search engine indexing"
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-gray-900 dark:text-white">Show real name</span>
            <span className="text-[12px] text-gray-500">Display your real name alongside your display name</span>
          </div>
          <Switch 
            size="sm" 
            isSelected={value.showRealName} 
            onChange={(val) => onChange({ ...value, showRealName: val })}
            aria-label="Show real name"
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </div>

        {value.showRealName && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2">
            <Field label="Real Name">
              <input 
                value={value.realName || ""} 
                placeholder="Your legal or real name" 
                onChange={(event) => onChange({ ...value, realName: event.target.value })} 
                className={fieldClass} 
              />
            </Field>
          </div>
        )}
      </div>
    </form>
  )
}
