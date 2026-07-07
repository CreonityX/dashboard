const fs = require('fs');

let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

// 1. Add imports
if (!content.includes('PopoverContent')) {
  content = content.replace(
    'import { Button, Tooltip, Input, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, DropdownPopover, Kbd } from "@heroui/react";',
    'import { Button, Tooltip, Input, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, DropdownPopover, Kbd, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem } from "@heroui/react";'
  );
}

// 2. Define SubMenu component
const subMenuComponent = `
const SubMenu = ({ label, icon, shortcut, items }: any) => {
  return (
    <DropdownItem key={label} textValue={label} className="p-0 bg-transparent data-[hover=true]:bg-transparent" closeOnSelect={false}>
      <Popover placement="right-start" offset={0} showArrow={false}>
        <PopoverTrigger>
          <div className="flex w-full items-center px-2 py-1.5 rounded-small hover:bg-default-100 dark:hover:bg-default-100 cursor-pointer">
            {icon && <div className="mr-2 text-default-500">{icon}</div>}
            <span className="flex-1 text-[14px] font-medium">{label}</span>
            {shortcut}
            <ChevronRight width={14} height={14} className="text-default-400 ml-auto" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-1 min-w-[200px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
          <Listbox aria-label={label + " Submenu"}>
            {items.map((item: any) => (
              <ListboxItem key={item.key || item.label} textValue={item.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
                <div className="flex items-center">
                  {item.icon && <div className="mr-2 text-default-500">{item.icon}</div>}
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{item.label}</span>
                  {item.extra && <span className="ml-auto text-default-400 text-tiny">{item.extra}</span>}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
    </DropdownItem>
  );
};
`;

if (!content.includes('const SubMenu = ({ label')) {
  // Insert it before export function DocsHeader
  content = content.replace('export function DocsHeader', subMenuComponent + '\nexport function DocsHeader');
}

const languageOptions = [
  { id: "en", label: "English" }, { id: "es", label: "Spanish (Español)" }, { id: "zh", label: "Chinese (中文)" },
  { id: "hi", label: "Hindi (हिन्दी)" }, { id: "ar", label: "Arabic (العربية)" }, { id: "pt", label: "Portuguese (Português)" },
  { id: "bn", label: "Bengali (বাংলা)" }, { id: "ru", label: "Russian (Русский)" }, { id: "ja", label: "Japanese (日本語)" },
  { id: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" }, { id: "de", label: "German (Deutsch)" }, { id: "fr", label: "French (Français)" },
  { id: "ko", label: "Korean (한국어)" }, { id: "vi", label: "Vietnamese (Tiếng Việt)" }, { id: "te", label: "Telugu (తెలుగు)" },
  { id: "mr", label: "Marathi (मराठी)" }, { id: "ta", label: "Tamil (தமிழ்)" }, { id: "tr", label: "Turkish (Türkçe)" },
  { id: "ur", label: "Urdu (اردو)" }, { id: "it", label: "Italian (Italiano)" }, { id: "th", label: "Thai (ไทย)" },
  { id: "gu", label: "Gujarati (ગુજરાતી)" }, { id: "fa", label: "Persian (فارسی)" }, { id: "pl", label: "Polish (Polski)" }
];

const fileMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="File Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <SubMenu label="New" icon={<FilePlus width={16} height={16} />} items={[{label: "Document"}, {label: "From a template"}]} />
                          <DropdownItem key="open" textValue="Open"><div className="flex w-full items-center"><FolderOpen width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Open</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>O</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="copy" showDivider textValue="Make a copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Make a copy</span></div></DropdownItem>

                          <SubMenu label="Download" icon={<ArrowDownToLine width={16} height={16} />} items={[{label: "Microsoft Word (.docx)"}, {label: "PDF Document (.pdf)"}, {label: "OpenDocument Format (.odt)"}, {label: "Plain Text (.txt)"}, {label: "Rich Text Format (.rtf)"}, {label: "Web Page (.html, zipped)"}, {label: "EPUB Publication (.epub)"}, {label: "Markdown (.md)"}]} />

                          <DropdownItem key="rename" textValue="Rename"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Rename</span></div></DropdownItem>
                          <DropdownItem key="trash" showDivider textValue="Move to trash"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Move to trash</span></div></DropdownItem>

                          <DropdownItem key="history" showDivider textValue="Version history"><div className="flex w-full items-center"><ClockArrowRotateLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Version history</span></div></DropdownItem>

                          <DropdownItem key="details" textValue="Details"><div className="flex w-full items-center"><CircleInfo width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Details</span></div></DropdownItem>
                          <SubMenu label="Language" icon={<Globe width={16} height={16} />} items={${JSON.stringify(languageOptions)}} />
                          <DropdownItem key="pagesetup" textValue="Page setup"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page setup</span></div></DropdownItem>
                          <DropdownItem key="print" textValue="Print"><div className="flex w-full items-center"><Printer width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Print</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>P</Kbd.Content></Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const insertMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Insert Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <SubMenu label="Image" icon={<Picture width={16} height={16} />} items={[{label: "Upload from computer"}, {label: "Search the web"}, {label: "Drive"}, {label: "Photos"}, {label: "By URL"}, {label: "Camera"}]} />
                          <SubMenu label="Table" icon={<LayoutCells width={16} height={16} />} items={[{label: "1x1"}, {label: "2x2"}, {label: "3x3"}, {label: "4x4"}, {label: "Custom..."}]} />
                          <SubMenu label="Building blocks" icon={<Cube width={16} height={16} />} items={[{label: "Meeting notes"}, {label: "Email draft"}, {label: "Project roadmap"}]} />
                          <SubMenu label="Smart chips" icon={<Star width={16} height={16} />} items={[{label: "People"}, {label: "File"}, {label: "Calendar event"}, {label: "Place"}]} />
                          <DropdownItem key="link" textValue="Link"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Link</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>K</Kbd.Content></Kbd></div></DropdownItem>
                          <SubMenu label="Drawing" icon={<Brush width={16} height={16} />} items={[{label: "New"}, {label: "From Drive"}]} />
                          <SubMenu label="Chart" icon={<ChartBar width={16} height={16} />} items={[{label: "Bar"}, {label: "Column"}, {label: "Line"}, {label: "Pie"}, {label: "From Sheets"}]} />
                          <SubMenu label="Symbols" icon={<FaceSmile width={16} height={16} />} items={[{label: "Equations"}, {label: "Special characters"}]} />
                          
                          <DropdownItem key="tab" textValue="Tab"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Tab</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="shift" /><Kbd.Content>F11</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="horizontal_line" textValue="Horizontal line"><div className="flex w-full items-center"><Minus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Horizontal line</span></div></DropdownItem>
                          <SubMenu label="Break" icon={<LayoutHeader width={16} height={16} className="rotate-180" />} items={[{label: "Page break"}, {label: "Section break (next page)"}, {label: "Section break (continuous)"}]} />
                          <DropdownItem key="bookmark" textValue="Bookmark"><div className="flex w-full items-center"><Bookmark width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Bookmark</span></div></DropdownItem>
                          <SubMenu label="Page elements" icon={<LayoutHeader width={16} height={16} />} items={[{label: "Headers & footers"}, {label: "Page numbers"}, {label: "Watermark"}]} />
                          
                          <DropdownItem key="comment" textValue="Comment"><div className="flex w-full items-center"><CommentPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Comment</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="option" /><Kbd.Content>M</Kbd.Content></Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const formatMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Format Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <SubMenu label="Text" icon={<Text width={16} height={16} />} items={[{label: "Bold"}, {label: "Italic"}, {label: "Underline"}, {label: "Strikethrough"}, {label: "Superscript"}, {label: "Subscript"}]} />
                          <SubMenu label="Paragraph styles" icon={<LayoutList width={16} height={16} />} items={[{label: "Normal text"}, {label: "Title"}, {label: "Subtitle"}, {label: "Heading 1"}, {label: "Heading 2"}, {label: "Heading 3"}]} />
                          <SubMenu label="Align & indent" icon={<TextAlignLeft width={16} height={16} />} items={[{label: "Left"}, {label: "Center"}, {label: "Right"}, {label: "Justified"}, {label: "Increase indent"}, {label: "Decrease indent"}]} />
                          <SubMenu label="Line & paragraph spacing" icon={<BarsAscendingAlignLeft width={16} height={16} />} items={[{label: "Single"}, {label: "1.15"}, {label: "1.5"}, {label: "Double"}, {label: "Add space before paragraph"}, {label: "Add space after paragraph"}]} />
                          <SubMenu label="Columns" icon={<LayoutCells width={16} height={16} />} items={[{label: "1 column"}, {label: "2 columns"}, {label: "3 columns"}]} />
                          <SubMenu label="Bullets & numbering" icon={<ListUl width={16} height={16} />} items={[{label: "Numbered list"}, {label: "Bulleted list"}, {label: "Checklist"}]} />
  
                          <DropdownItem key="headers" textValue="Headers & footers"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Headers & footers</span></div></DropdownItem>
                          <DropdownItem key="page_numbers" textValue="Page numbers"><div className="flex w-full items-center"><Hashtag width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page numbers</span></div></DropdownItem>
                          <DropdownItem key="page_orientation" textValue="Page orientation"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page orientation</span></div></DropdownItem>
                          <DropdownItem key="pageless" showDivider textValue="Switch to Pageless format"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Switch to Pageless format</span></div></DropdownItem>
  
                          <SubMenu label="Table" icon={<LayoutCells width={16} height={16} />} items={[{label: "Insert row above"}, {label: "Insert row below"}, {label: "Insert column left"}, {label: "Insert column right"}, {label: "Delete row"}, {label: "Delete column"}, {label: "Delete table"}]} />
                          <SubMenu label="Image" icon={<Picture width={16} height={16} />} items={[{label: "Image options"}, {label: "Replace image"}]} />
                          <SubMenu label="Borders & lines" icon={<Minus width={16} height={16} />} items={[{label: "Border color"}, {label: "Border dash"}, {label: "Border weight"}]} />
  
                          <DropdownItem key="clear" textValue="Clear formatting"><div className="flex w-full items-center"><Eraser width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Clear formatting</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>\\</Kbd.Content></Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const toolsMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Tools Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <SubMenu label="Spelling and grammar" icon={<ListCheck width={16} height={16} />} items={[{label: "Spelling and grammar check"}, {label: "Personal dictionary"}]} />
                          <DropdownItem key="wordcount" textValue="Word count"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Word count</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>C</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="reviewedits" textValue="Review suggested edits"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Review suggested edits</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="ctrl" /><Kbd.Abbr keyValue="command" /><Kbd.Content>O</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="compare" textValue="Compare documents"><div className="flex w-full items-center"><ArrowRightArrowLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Compare documents</span></div></DropdownItem>
                          <DropdownItem key="citations" textValue="Citations"><div className="flex w-full items-center"><QuoteClose width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Citations</span></div></DropdownItem>
                          <DropdownItem key="linenumbers" textValue="Line numbers"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Line numbers</span></div></DropdownItem>
                          <DropdownItem key="linkedobj" textValue="Linked objects"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Linked objects</span></div></DropdownItem>
                          <DropdownItem key="dictionary" showDivider textValue="Dictionary"><div className="flex w-full items-center"><Book width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Dictionary</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>Y</Kbd.Content></Kbd></div></DropdownItem>

                          <DropdownItem key="translate" showDivider textValue="Translate document"><div className="flex w-full items-center"><Globe width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Translate document</span></div></DropdownItem>

                          <DropdownItem key="accessibility" showDivider textValue="Accessibility"><div className="flex w-full items-center"><PersonPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Accessibility</span></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

// (Edit and View menus are unchanged from before as they didn't have any submenus, but we'll include them to build completeJSX correctly)

const editMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Edit Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="undo" textValue="Undo"><div className="flex w-full items-center"><ArrowUturnCcwLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Undo</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>Z</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="redo" showDivider textValue="Redo"><div className="flex w-full items-center"><ArrowUturnCwRight width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Redo</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>Y</Kbd.Content></Kbd></div></DropdownItem>

                          <DropdownItem key="cut" textValue="Cut"><div className="flex w-full items-center"><Scissors width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Cut</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>X</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="copy" textValue="Copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Copy</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>C</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="paste" textValue="Paste"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Paste</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>V</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="pastenofmt" showDivider textValue="Paste without formatting"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Paste without formatting</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>V</Kbd.Content></Kbd></div></DropdownItem>

                          <DropdownItem key="selectall" textValue="Select all"><div className="flex w-full items-center"><SquareDashed width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Select all</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Content>A</Kbd.Content></Kbd></div></DropdownItem>
                          <DropdownItem key="delete" showDivider textValue="Delete"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Delete</span></div></DropdownItem>

                          <DropdownItem key="findreplace" textValue="Find and replace"><div className="flex w-full items-center"><Magnifier width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Find and replace</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>H</Kbd.Content></Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const viewMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="View Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="printlayout" textValue="Show print layout"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Show print layout</span></div></DropdownItem>
                          <DropdownItem key="ruler" textValue="Show ruler"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Show ruler</span></div></DropdownItem>
                          <DropdownItem key="eqtoolbar" textValue="Show equation toolbar"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show equation toolbar</span></div></DropdownItem>
                          <DropdownItem key="nonprinting" showDivider textValue="Show non-printing characters"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show non-printing characters</span><Kbd variant="light" className="ml-auto text-default-500"><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>P</Kbd.Content></Kbd></div></DropdownItem>

                          <DropdownItem key="fullscreen" textValue="Full screen"><div className="flex w-full items-center"><ArrowsExpand width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Full screen</span></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const completeJSX = `            <div className="flex items-center gap-1 -ml-2 -mt-0.5">
              {menuItems.map((item) => {
                if (item === "File") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${fileMenu}
                    </Dropdown>
                  );
                }
                
                if (item === "Edit") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${editMenu}
                    </Dropdown>
                  );
                }
                
                if (item === "View") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${viewMenu}
                    </Dropdown>
                  );
                }
                
                if (item === "Insert") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${insertMenu}
                    </Dropdown>
                  );
                }
                
                if (item === "Format") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${formatMenu}
                    </Dropdown>
                  );
                }
                
                if (item === "Tools") {
                  return (
                    <Dropdown key={item} placement="bottom-start" radius="sm">
                      <DropdownTrigger>
                        <Button variant="light" size="sm" className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium">
                          {item}
                        </Button>
                      </DropdownTrigger>
${toolsMenu}
                    </Dropdown>
                  );
                }

                return (
                  <Button 
                    key={item} 
                    variant="light" 
                    size="sm" 
                    className="h-7 min-w-0 px-2 text-sm text-default-600 font-medium"
                  >
                    {item}
                  </Button>
                );
              })}
            </div>`;

const startMarker = '<div className="flex items-center gap-1 -ml-2 -mt-0.5">';
const startIdx = content.indexOf(startMarker);

const endMarker = '          </div>\n        </div>\n\n        {/* Right Actions */}';
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + completeJSX + "\n" + content.substring(endIdx);
  fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
  console.log("Successfully rebuilt menuItems block with nested SubMenu components!");
} else {
  console.error("Could not find markers", {startIdx, endIdx});
}
