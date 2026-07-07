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
    }, 150);
  };

  return (
    <DropdownItem 
      key={label} 
      textValue={label} 
      className="relative group" 
      closeOnSelect={false}
      startContent={icon && <div className="text-default-500">{icon}</div>}
      endContent={
        <div className="flex items-center gap-2">
          {shortcut}
          <ChevronRight width={14} height={14} className="text-default-400" />
          <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="right-start" offset={10}>
            <PopoverTrigger>
              <div 
                className="absolute inset-0 w-full h-full z-10 cursor-pointer" 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </PopoverTrigger>
            <PopoverContent 
              className="p-1 min-w-[200px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
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
      }
    >
      <span className="text-[14px] font-medium">{label}</span>
    </DropdownItem>
  );
};
`;

  content = content.substring(0, startIndex) + newSubMenuComponent + "\n" + content.substring(endIndex);
  fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
  console.log("Updated SubMenu layout successfully.");
} else {
  console.log("Could not find SubMenu component or DocsHeader export.");
}
