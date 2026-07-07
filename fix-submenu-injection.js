const fs = require('fs');

let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

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
  if (content.includes('export const DocsHeader')) {
    content = content.replace('export const DocsHeader', subMenuComponent + '\nexport const DocsHeader');
    fs.writeFileSync('components/creonity-docs/docs-header.tsx', content);
    console.log("Injected SubMenu successfully.");
  } else {
    console.log("DocsHeader export not found.");
  }
} else {
  console.log("SubMenu already exists.");
}
