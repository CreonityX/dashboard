const fs = require('fs');
let content = fs.readFileSync('components/creonity-docs/docs-header.tsx', 'utf8');

const lines = content.split('\n');
let changed = 0;
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('<DropdownItem') && line.includes('</DropdownItem>')) {
    
    const match = line.match(/^(\s*)<DropdownItem([^>]*)>(.*?)<\/DropdownItem>/);
    if (!match) continue;

    const indent = match[1];
    let props = match[2];
    const text = match[3];

    let startContent = "";
    props = props.replace(/startContent=\{((?:[^{}]*\{[^{}]*\}[^{}]*)*|[^}]+)\}/, (m, c) => {
      startContent = c;
      return '';
    });
    
    let endContent = "";
    props = props.replace(/endContent=\{((?:[^{}]*\{[^{}]*\}[^{}]*)*|[^}]+)\}/, (m, c) => {
       endContent = c;
       return '';
    });
    
    if (startContent || endContent) {
      props = props.replace(/\s+/g, ' ').trim();
      let newProps = props ? ` ${props} textValue="${text}"` : ` textValue="${text}"`;
      
      let inner = '<div className="flex w-full items-center">';
      if (startContent) inner += startContent;
      inner += `<span className="flex-1">${text}</span>`;
      if (endContent) inner += endContent;
      inner += '</div>';
      
      lines[i] = `${indent}<DropdownItem${newProps}>${inner}</DropdownItem>`;
      changed++;
    }
  }
}
console.log(`Changed ${changed} lines`);
fs.writeFileSync('components/creonity-docs/docs-header.tsx', lines.join('\n'));
