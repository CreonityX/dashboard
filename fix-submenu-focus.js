const fs = require('fs');

let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

const oldSubMenuStart = 'const SubMenu = ({ label, icon, shortcut, items }: any) => {';
const oldSubMenuEnd = 'export const DocsHeader';

const startIndex = content.indexOf(oldSubMenuStart);
const endIndex = content.indexOf('export const DocsHeader');

if (startIndex !== -1 && endIndex !== -1) {
  const newSubMenuComponent = `
const SubMenu = ({ label, icon, shortcut, items }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<any>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  return (
    <DropdownItem 
      key={label} 
      textValue={label} 
      className="p-0 bg-transparent data-[hover=true]:bg-transparent" 
      closeOnSelect={false}
    >
      <div 
        className={\`relative flex w-full items-center px-2 py-1.5 rounded-small transition-colors \${isOpen ? "bg-default-100 dark:bg-white/10" : "hover:bg-default-100 dark:hover:bg-white/10"}\`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon && <div className="mr-2 text-default-500">{icon}</div>}
        <span className="flex-1 text-[14px] font-medium text-[#0a0a0a] dark:text-white">{label}</span>
        {shortcut}
        <ChevronRight width={14} height={14} className="text-default-400 ml-auto" />
        
        <Popover 
          isOpen={isOpen} 
          onOpenChange={setIsOpen} 
          placement="right-start" 
          offset={14}
          shouldFocusOnOpen={false}
          shouldCloseOnBlur={false}
          isKeyboardDismissDisabled={true}
          shouldBlockScroll={false}
        >
          <PopoverTrigger>
            <div className="absolute inset-0 w-full h-full pointer-events-none" />
          </PopoverTrigger>
          <PopoverContent 
            className="p-1 min-w-[200px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] overflow-visible"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Transparent bridge to prevent gap flicker */}
            <div className="absolute -left-[14px] top-0 w-[14px] h-full bg-transparent" />
            
            <ListBox aria-label={label + " Submenu"}>
              {items.map((item: any) => (
                <ListBoxItem key={item.key || item.label} textValue={item.label} className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2">
                  <div className="flex items-center">
                    {item.icon && <div className="mr-2 text-default-500">{item.icon}</div>}
                    <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{item.label}</span>
                    {item.extra && <span className="ml-auto text-default-400 text-tiny">{item.extra}</span>}
                  </div>
                </ListBoxItem>
              ))}
            </ListBox>
          </PopoverContent>
        </Popover>
      </div>
    </DropdownItem>
  );
};
`;

  content = content.substring(0, startIndex) + newSubMenuComponent + "\n" + content.substring(endIndex);
  fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
  console.log("Updated SubMenu to disable focus stealing and bridge the gap.");
} else {
  console.log("Could not find SubMenu component or DocsHeader export.");
}
