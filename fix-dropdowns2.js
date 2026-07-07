const fs = require('fs');
let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

const insertMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Insert Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="image" textValue="Image"><div className="flex w-full items-center"><Picture width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Image</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="table" textValue="Table"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Table</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="building_blocks" textValue="Building blocks"><div className="flex w-full items-center"><Cube width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Building blocks</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="smart_chips" textValue="Smart chips"><div className="flex w-full items-center"><Star width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Smart chips</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="link" textValue="Link"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Link</span><Kbd keys={["command"]}>K</Kbd></div></DropdownItem>
                          <DropdownItem key="drawing" textValue="Drawing"><div className="flex w-full items-center"><Brush width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Drawing</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="chart" textValue="Chart"><div className="flex w-full items-center"><ChartBar width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Chart</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="symbols" showDivider textValue="Symbols"><div className="flex w-full items-center"><FaceSmile width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Symbols</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          
                          <DropdownItem key="tab" textValue="Tab"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Tab</span><span className="text-tiny text-default-400 ml-auto">Shift+F11</span></div></DropdownItem>
                          <DropdownItem key="horizontal_line" textValue="Horizontal line"><div className="flex w-full items-center"><Minus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Horizontal line</span></div></DropdownItem>
                          <DropdownItem key="break" textValue="Break"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="rotate-180 text-default-500 mr-2" /><span className="flex-1">Break</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="bookmark" textValue="Bookmark"><div className="flex w-full items-center"><Bookmark width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Bookmark</span></div></DropdownItem>
                          <DropdownItem key="page_elements" showDivider textValue="Page elements"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page elements</span><div className="flex items-center gap-2 ml-auto"><span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">Updated</span><ChevronDown width={14} height={14} className="text-default-400" /></div></div></DropdownItem>
                          
                          <DropdownItem key="comment" textValue="Comment"><div className="flex w-full items-center"><CommentPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Comment</span><Kbd keys={["command", "option"]}>M</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const formatMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Format Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="text" textValue="Text"><div className="flex w-full items-center"><Text width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Text</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="paragraph_styles" textValue="Paragraph styles"><div className="flex w-full items-center"><LayoutList width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Paragraph styles</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="align_indent" textValue="Align & indent"><div className="flex w-full items-center"><TextAlignLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Align & indent</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="line_spacing" textValue="Line & paragraph spacing"><div className="flex w-full items-center"><BarsAscendingAlignLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Line & paragraph spacing</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="columns" textValue="Columns"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Columns</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="bullets" showDivider textValue="Bullets & numbering"><div className="flex w-full items-center"><ListUl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Bullets & numbering</span><ChevronDown width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
  
                          <DropdownItem key="headers" textValue="Headers & footers"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Headers & footers</span></div></DropdownItem>
                          <DropdownItem key="page_numbers" textValue="Page numbers"><div className="flex w-full items-center"><Hashtag width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page numbers</span></div></DropdownItem>
                          <DropdownItem key="page_orientation" textValue="Page orientation"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page orientation</span></div></DropdownItem>
                          <DropdownItem key="pageless" showDivider textValue="Switch to Pageless format"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Switch to Pageless format</span></div></DropdownItem>
  
                          <DropdownItem key="table" className="text-default-400" isDisabled textValue="Table"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Table</span><ChevronDown width={14} height={14} className="text-default-300 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="image" className="text-default-400" isDisabled textValue="Image"><div className="flex w-full items-center"><Picture width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Image</span><ChevronDown width={14} height={14} className="text-default-300 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="borders" showDivider className="text-default-400" isDisabled textValue="Borders & lines"><div className="flex w-full items-center"><Minus width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Borders & lines</span><ChevronDown width={14} height={14} className="text-default-300 ml-auto" /></div></DropdownItem>
  
                          <DropdownItem key="clear" textValue="Clear formatting"><div className="flex w-full items-center"><Eraser width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Clear formatting</span><Kbd keys={["command"]}>\\</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const fileMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="File Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="new" textValue="New"><div className="flex w-full items-center"><FilePlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">New</span><div className="flex items-center gap-2 ml-auto"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-tiny text-default-400">▶</span></div></div></DropdownItem>
                          <DropdownItem key="open" textValue="Open"><div className="flex w-full items-center"><FolderOpen width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Open</span><Kbd keys={["command"]}>O</Kbd></div></DropdownItem>
                          <DropdownItem key="copy" showDivider textValue="Make a copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Make a copy</span></div></DropdownItem>

                          <DropdownItem key="share" textValue="Share"><div className="flex w-full items-center"><PersonPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Share</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="email" textValue="Email"><div className="flex w-full items-center"><Envelope width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Email</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="download" showDivider textValue="Download"><div className="flex w-full items-center"><ArrowDownToLine width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Download</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>

                          <DropdownItem key="rename" textValue="Rename"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Rename</span></div></DropdownItem>
                          <DropdownItem key="move" textValue="Move"><div className="flex w-full items-center"><FolderOpen width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Move</span></div></DropdownItem>
                          <DropdownItem key="shortcut" textValue="Add shortcut to Drive"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Add shortcut to Drive</span></div></DropdownItem>
                          <DropdownItem key="trash" showDivider textValue="Move to trash"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Move to trash</span></div></DropdownItem>

                          <DropdownItem key="history" showDivider textValue="Version history"><div className="flex w-full items-center"><ClockArrowRotateLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Version history</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>

                          <DropdownItem key="details" textValue="Details"><div className="flex w-full items-center"><CircleInfo width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Details</span></div></DropdownItem>
                          <DropdownItem key="security" textValue="Security limitations"><div className="flex w-full items-center"><ShieldCheck width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Security limitations</span></div></DropdownItem>
                          <DropdownItem key="language" textValue="Language"><div className="flex w-full items-center"><Globe width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Language</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="pagesetup" textValue="Page setup"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page setup</span></div></DropdownItem>
                          <DropdownItem key="print" textValue="Print"><div className="flex w-full items-center"><Printer width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Print</span><Kbd keys={["command"]}>P</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const editMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Edit Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="undo" textValue="Undo"><div className="flex w-full items-center"><ArrowUturnCcwLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Undo</span><Kbd keys={["command"]}>Z</Kbd></div></DropdownItem>
                          <DropdownItem key="redo" showDivider textValue="Redo"><div className="flex w-full items-center"><ArrowUturnCwRight width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Redo</span><Kbd keys={["command"]}>Y</Kbd></div></DropdownItem>

                          <DropdownItem key="cut" className="text-default-400" isDisabled textValue="Cut"><div className="flex w-full items-center"><Scissors width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Cut</span><Kbd keys={["command"]} className="text-default-300">X</Kbd></div></DropdownItem>
                          <DropdownItem key="copy" className="text-default-400" isDisabled textValue="Copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Copy</span><Kbd keys={["command"]} className="text-default-300">C</Kbd></div></DropdownItem>
                          <DropdownItem key="paste" textValue="Paste"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Paste</span><Kbd keys={["command"]}>V</Kbd></div></DropdownItem>
                          <DropdownItem key="pastenofmt" showDivider textValue="Paste without formatting"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Paste without formatting</span><Kbd keys={["command", "shift"]}>V</Kbd></div></DropdownItem>

                          <DropdownItem key="selectall" textValue="Select all"><div className="flex w-full items-center"><SquareDashed width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Select all</span><Kbd keys={["command"]}>A</Kbd></div></DropdownItem>
                          <DropdownItem key="delete" showDivider className="text-default-400" isDisabled textValue="Delete"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-300 mr-2" /><span className="flex-1">Delete</span></div></DropdownItem>

                          <DropdownItem key="findreplace" textValue="Find and replace"><div className="flex w-full items-center"><Magnifier width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Find and replace</span><Kbd keys={["command", "shift"]}>H</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const viewMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="View Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="mode" textValue="Mode"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Mode</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="comments" textValue="Comments"><div className="flex w-full items-center"><CommentPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Comments</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="collapse" showDivider textValue="Collapse tabs & outlines sidebar"><div className="flex w-full items-center"><ListUl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Collapse tabs & outlines sidebar</span><span className="text-tiny text-default-400 ml-auto font-mono">⌃⌘A ⌃⌘H</span></div></DropdownItem>

                          <DropdownItem key="printlayout" textValue="Show print layout"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Show print layout</span></div></DropdownItem>
                          <DropdownItem key="ruler" textValue="Show ruler"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Show ruler</span></div></DropdownItem>
                          <DropdownItem key="eqtoolbar" textValue="Show equation toolbar"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show equation toolbar</span></div></DropdownItem>
                          <DropdownItem key="nonprinting" showDivider textValue="Show non-printing characters"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show non-printing characters</span><Kbd keys={["command", "shift"]}>P</Kbd></div></DropdownItem>

                          <DropdownItem key="fullscreen" textValue="Full screen"><div className="flex w-full items-center"><ArrowsExpand width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Full screen</span></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const toolsMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Tools Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="spell" textValue="Spelling and grammar"><div className="flex w-full items-center"><ListCheck width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Spelling and grammar</span><span className="text-tiny text-default-400 ml-auto">▶</span></div></DropdownItem>
                          <DropdownItem key="wordcount" textValue="Word count"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Word count</span><Kbd keys={["command", "shift"]}>C</Kbd></div></DropdownItem>
                          <DropdownItem key="reviewedits" textValue="Review suggested edits"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Review suggested edits</span><span className="text-tiny text-default-400 ml-auto font-mono">⌃⌘O ⌃⌘U</span></div></DropdownItem>
                          <DropdownItem key="compare" textValue="Compare documents"><div className="flex w-full items-center"><ArrowRightArrowLeft width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Compare documents</span></div></DropdownItem>
                          <DropdownItem key="citations" textValue="Citations"><div className="flex w-full items-center"><QuoteClose width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Citations</span></div></DropdownItem>
                          <DropdownItem key="linenumbers" textValue="Line numbers"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Line numbers</span></div></DropdownItem>
                          <DropdownItem key="linkedobj" textValue="Linked objects"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Linked objects</span></div></DropdownItem>
                          <DropdownItem key="dictionary" showDivider textValue="Dictionary"><div className="flex w-full items-center"><Book width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Dictionary</span><Kbd keys={["command", "shift"]}>Y</Kbd></div></DropdownItem>

                          <DropdownItem key="translate" showDivider textValue="Translate document"><div className="flex w-full items-center"><Globe width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Translate document</span></div></DropdownItem>

                          <DropdownItem key="notifications" textValue="Notification settings"><div className="flex w-full items-center"><Bell width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Notification settings</span></div></DropdownItem>
                          <DropdownItem key="preferences" textValue="Preferences"><div className="flex w-full items-center"><Gear width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Preferences</span></div></DropdownItem>
                          <DropdownItem key="accessibility" showDivider textValue="Accessibility"><div className="flex w-full items-center"><PersonPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Accessibility</span></div></DropdownItem>

                          <DropdownItem key="activity" textValue="Activity dashboard"><div className="flex w-full items-center"><ChartLine width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Activity dashboard</span></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

// Now, replace the corrupted popovers!
content = content.replace(/<DropdownPopover className="w-\[320px\].*?aria-label="Insert Menu"[\s\S]*?<\/DropdownPopover>/, insertMenu);
content = content.replace(/<DropdownPopover className="w-\[320px\].*?aria-label="Format Menu"[\s\S]*?<\/DropdownPopover>/, formatMenu);
content = content.replace(/<DropdownPopover className="w-\[300px\].*?aria-label="File Menu"[\s\S]*?<\/DropdownPopover>/, fileMenu);
content = content.replace(/<DropdownPopover className="w-\[300px\].*?aria-label="Edit Menu"[\s\S]*?<\/DropdownPopover>/, editMenu);
content = content.replace(/<DropdownPopover className="w-\[300px\].*?aria-label="View Menu"[\s\S]*?<\/DropdownPopover>/, viewMenu);
content = content.replace(/<DropdownPopover className="w-\[300px\].*?aria-label="Tools Menu"[\s\S]*?<\/DropdownPopover>/, toolsMenu);

fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
console.log('Fixed menus!');
