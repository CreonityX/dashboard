const fs = require('fs');

const insertMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Insert Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="image" textValue="Image"><div className="flex w-full items-center"><Picture width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Image</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="table" textValue="Table"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Table</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="building_blocks" textValue="Building blocks"><div className="flex w-full items-center"><Cube width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Building blocks</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="smart_chips" textValue="Smart chips"><div className="flex w-full items-center"><Star width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Smart chips</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="link" textValue="Link"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Link</span><Kbd keys={["command"]}>K</Kbd></div></DropdownItem>
                          <DropdownItem key="drawing" textValue="Drawing"><div className="flex w-full items-center"><Brush width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Drawing</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="chart" textValue="Chart"><div className="flex w-full items-center"><ChartBar width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Chart</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="symbols" showDivider textValue="Symbols"><div className="flex w-full items-center"><FaceSmile width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Symbols</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          
                          <DropdownItem key="tab" textValue="Tab"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Tab</span><span className="text-tiny text-default-400 ml-auto">Shift+F11</span></div></DropdownItem>
                          <DropdownItem key="horizontal_line" textValue="Horizontal line"><div className="flex w-full items-center"><Minus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Horizontal line</span></div></DropdownItem>
                          <DropdownItem key="break" textValue="Break"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="rotate-180 text-default-500 mr-2" /><span className="flex-1">Break</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="bookmark" textValue="Bookmark"><div className="flex w-full items-center"><Bookmark width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Bookmark</span></div></DropdownItem>
                          <DropdownItem key="page_elements" showDivider textValue="Page elements"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Page elements</span><div className="flex items-center gap-2 ml-auto"><span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">Updated</span><ChevronRight width={14} height={14} className="text-default-400" /></div></div></DropdownItem>
                          
                          <DropdownItem key="comment" textValue="Comment"><div className="flex w-full items-center"><CommentPlus width={16} height={16} className="text-default-500 mr-2" /><span className="flex-1">Comment</span><Kbd keys={["command", "option"]}>M</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const formatMenu = `                      <DropdownPopover className="w-[320px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Format Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="text" isDisabled className="text-default-400" textValue="Text"><div className="flex w-full items-center"><Text width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Text</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="paragraph_styles" isDisabled className="text-default-400" textValue="Paragraph styles"><div className="flex w-full items-center"><LayoutList width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Paragraph styles</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="align_indent" isDisabled className="text-default-400" textValue="Align & indent"><div className="flex w-full items-center"><TextAlignLeft width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Align & indent</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="line_spacing" isDisabled className="text-default-400" textValue="Line & paragraph spacing"><div className="flex w-full items-center"><BarsAscendingAlignLeft width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Line & paragraph spacing</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="columns" isDisabled className="text-default-400" textValue="Columns"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Columns</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="bullets" showDivider isDisabled className="text-default-400" textValue="Bullets & numbering"><div className="flex w-full items-center"><ListUl width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Bullets & numbering</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
  
                          <DropdownItem key="headers" isDisabled className="text-default-400" textValue="Headers & footers"><div className="flex w-full items-center"><LayoutHeader width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Headers & footers</span></div></DropdownItem>
                          <DropdownItem key="page_numbers" isDisabled className="text-default-400" textValue="Page numbers"><div className="flex w-full items-center"><Hashtag width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Page numbers</span></div></DropdownItem>
                          <DropdownItem key="page_orientation" isDisabled className="text-default-400" textValue="Page orientation"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Page orientation</span></div></DropdownItem>
                          <DropdownItem key="pageless" showDivider isDisabled className="text-default-400" textValue="Switch to Pageless format"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Switch to Pageless format</span></div></DropdownItem>
  
                          <DropdownItem key="table" isDisabled className="text-default-400" textValue="Table"><div className="flex w-full items-center"><LayoutCells width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Table</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="image" isDisabled className="text-default-400" textValue="Image"><div className="flex w-full items-center"><Picture width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Image</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="borders" showDivider isDisabled className="text-default-400" textValue="Borders & lines"><div className="flex w-full items-center"><Minus width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Borders & lines</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
  
                          <DropdownItem key="clear" isDisabled className="text-default-400" textValue="Clear formatting"><div className="flex w-full items-center"><Eraser width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Clear formatting</span><Kbd keys={["command"]}>\\</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const fileMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="File Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="new" isDisabled className="text-default-400" textValue="New"><div className="flex w-full items-center"><FilePlus width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">New</span><div className="flex items-center gap-2 ml-auto"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50" /><ChevronRight width={14} height={14} className="text-default-400" /></div></div></DropdownItem>
                          <DropdownItem key="open" isDisabled className="text-default-400" textValue="Open"><div className="flex w-full items-center"><FolderOpen width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Open</span><Kbd keys={["command"]}>O</Kbd></div></DropdownItem>
                          <DropdownItem key="copy" showDivider isDisabled className="text-default-400" textValue="Make a copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Make a copy</span></div></DropdownItem>

                          <DropdownItem key="download" showDivider isDisabled className="text-default-400" textValue="Download"><div className="flex w-full items-center"><ArrowDownToLine width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Download</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>

                          <DropdownItem key="rename" isDisabled className="text-default-400" textValue="Rename"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Rename</span></div></DropdownItem>
                          <DropdownItem key="trash" showDivider isDisabled className="text-default-400" textValue="Move to trash"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Move to trash</span></div></DropdownItem>

                          <DropdownItem key="history" showDivider isDisabled className="text-default-400" textValue="Version history"><div className="flex w-full items-center"><ClockArrowRotateLeft width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Version history</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>

                          <DropdownItem key="details" isDisabled className="text-default-400" textValue="Details"><div className="flex w-full items-center"><CircleInfo width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Details</span></div></DropdownItem>
                          <DropdownItem key="language" isDisabled className="text-default-400" textValue="Language"><div className="flex w-full items-center"><Globe width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Language</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="pagesetup" isDisabled className="text-default-400" textValue="Page setup"><div className="flex w-full items-center"><FileText width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Page setup</span></div></DropdownItem>
                          <DropdownItem key="print" isDisabled className="text-default-400" textValue="Print"><div className="flex w-full items-center"><Printer width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Print</span><Kbd keys={["command"]}>P</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const editMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Edit Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="undo" isDisabled className="text-default-400" textValue="Undo"><div className="flex w-full items-center"><ArrowUturnCcwLeft width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Undo</span><Kbd keys={["command"]}>Z</Kbd></div></DropdownItem>
                          <DropdownItem key="redo" showDivider isDisabled className="text-default-400" textValue="Redo"><div className="flex w-full items-center"><ArrowUturnCwRight width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Redo</span><Kbd keys={["command"]}>Y</Kbd></div></DropdownItem>

                          <DropdownItem key="cut" isDisabled className="text-default-400" textValue="Cut"><div className="flex w-full items-center"><Scissors width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Cut</span><Kbd keys={["command"]} className="text-default-400">X</Kbd></div></DropdownItem>
                          <DropdownItem key="copy" isDisabled className="text-default-400" textValue="Copy"><div className="flex w-full items-center"><CopyTransparent width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Copy</span><Kbd keys={["command"]} className="text-default-400">C</Kbd></div></DropdownItem>
                          <DropdownItem key="paste" isDisabled className="text-default-400" textValue="Paste"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Paste</span><Kbd keys={["command"]}>V</Kbd></div></DropdownItem>
                          <DropdownItem key="pastenofmt" showDivider isDisabled className="text-default-400" textValue="Paste without formatting"><div className="flex w-full items-center"><FileArrowDown width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Paste without formatting</span><Kbd keys={["command", "shift"]}>V</Kbd></div></DropdownItem>

                          <DropdownItem key="selectall" isDisabled className="text-default-400" textValue="Select all"><div className="flex w-full items-center"><SquareDashed width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Select all</span><Kbd keys={["command"]}>A</Kbd></div></DropdownItem>
                          <DropdownItem key="delete" showDivider isDisabled className="text-default-400" textValue="Delete"><div className="flex w-full items-center"><TrashBin width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Delete</span></div></DropdownItem>

                          <DropdownItem key="findreplace" isDisabled className="text-default-400" textValue="Find and replace"><div className="flex w-full items-center"><Magnifier width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Find and replace</span><Kbd keys={["command", "shift"]}>H</Kbd></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const viewMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="View Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="printlayout" isDisabled className="text-default-400" textValue="Show print layout"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Show print layout</span></div></DropdownItem>
                          <DropdownItem key="ruler" isDisabled className="text-default-400" textValue="Show ruler"><div className="flex w-full items-center"><Check width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Show ruler</span></div></DropdownItem>
                          <DropdownItem key="eqtoolbar" isDisabled className="text-default-400" textValue="Show equation toolbar"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show equation toolbar</span></div></DropdownItem>
                          <DropdownItem key="nonprinting" showDivider isDisabled className="text-default-400" textValue="Show non-printing characters"><div className="flex w-full items-center"><div className="w-4 mr-2" /><span className="flex-1">Show non-printing characters</span><Kbd keys={["command", "shift"]}>P</Kbd></div></DropdownItem>

                          <DropdownItem key="fullscreen" isDisabled className="text-default-400" textValue="Full screen"><div className="flex w-full items-center"><ArrowsExpand width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Full screen</span></div></DropdownItem>
                        </DropdownMenu>
                      </DropdownPopover>`;

const toolsMenu = `                      <DropdownPopover className="w-[300px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                        <DropdownMenu aria-label="Tools Menu" className="w-full" itemClasses={{ base: "gap-3" }}>
                          <DropdownItem key="spell" isDisabled className="text-default-400" textValue="Spelling and grammar"><div className="flex w-full items-center"><ListCheck width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Spelling and grammar</span><ChevronRight width={14} height={14} className="text-default-400 ml-auto" /></div></DropdownItem>
                          <DropdownItem key="wordcount" isDisabled className="text-default-400" textValue="Word count"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Word count</span><Kbd keys={["command", "shift"]}>C</Kbd></div></DropdownItem>
                          <DropdownItem key="reviewedits" isDisabled className="text-default-400" textValue="Review suggested edits"><div className="flex w-full items-center"><Pencil width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Review suggested edits</span><span className="text-tiny text-default-400 ml-auto font-mono">⌃⌘O ⌃⌘U</span></div></DropdownItem>
                          <DropdownItem key="compare" isDisabled className="text-default-400" textValue="Compare documents"><div className="flex w-full items-center"><ArrowRightArrowLeft width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Compare documents</span></div></DropdownItem>
                          <DropdownItem key="citations" isDisabled className="text-default-400" textValue="Citations"><div className="flex w-full items-center"><QuoteClose width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Citations</span></div></DropdownItem>
                          <DropdownItem key="linenumbers" isDisabled className="text-default-400" textValue="Line numbers"><div className="flex w-full items-center"><ListOl width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Line numbers</span></div></DropdownItem>
                          <DropdownItem key="linkedobj" isDisabled className="text-default-400" textValue="Linked objects"><div className="flex w-full items-center"><Link width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Linked objects</span></div></DropdownItem>
                          <DropdownItem key="dictionary" showDivider isDisabled className="text-default-400" textValue="Dictionary"><div className="flex w-full items-center"><Book width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Dictionary</span><Kbd keys={["command", "shift"]}>Y</Kbd></div></DropdownItem>

                          <DropdownItem key="translate" showDivider isDisabled className="text-default-400" textValue="Translate document"><div className="flex w-full items-center"><Globe width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Translate document</span></div></DropdownItem>

                          <DropdownItem key="accessibility" showDivider isDisabled className="text-default-400" textValue="Accessibility"><div className="flex w-full items-center"><PersonPlus width={16} height={16} className="text-default-400 mr-2" /><span className="flex-1">Accessibility</span></div></DropdownItem>
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

let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

const startMarker = '<div className="flex items-center gap-1 -ml-2 -mt-0.5">';
const startIdx = content.indexOf(startMarker);

const endMarker = '          </div>\n        </div>\n\n        {/* Right Actions */}';
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + completeJSX + "\n" + content.substring(endIdx);
  fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
  console.log("Successfully rebuilt menuItems block!");
} else {
  console.error("Could not find markers", {startIdx, endIdx});
}
