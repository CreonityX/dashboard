const fs = require('fs');
const path = require('path');

const baseClass = "rounded-xl border border-[#e4e4e7] bg-white text-[#0a0a0a] shadow-sm outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white";

const selectOld = 'className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-medium text-[#0a0a0a] dark:text-white rounded-xl h-10 px-3 outline-none cursor-pointer"';
const selectNew = `className="h-11 w-full cursor-pointer appearance-auto px-3.5 text-[13.5px] font-medium ${baseClass}"`;

const textareaOld1 = 'className="w-full min-h-[120px] p-4 text-[14px] text-[#0a0a0a] dark:text-white bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-xl outline-none resize-y"';
const textareaNew1 = `className="min-h-[104px] w-full resize-y px-3.5 py-3 text-[13.5px] font-medium leading-6 ${baseClass}"`;

const textareaOld2 = 'className="w-full min-h-[100px] p-4 text-[14px] text-[#0a0a0a] dark:text-white bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-xl outline-none resize-y font-mono"';
const textareaNew2 = `className="min-h-[104px] w-full resize-y px-3.5 py-3 text-[13.5px] font-mono font-medium leading-6 ${baseClass}"`;

const textareaOld3 = 'className="w-full min-h-[80px] p-4 text-[14px] text-[#0a0a0a] dark:text-white bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-xl outline-none resize-y"';
const textareaNew3 = `className="min-h-[104px] w-full resize-y px-3.5 py-3 text-[13.5px] font-medium leading-6 ${baseClass}"`;

const inputOld = 'className="bg-[#f4f4f5] dark:bg-[#1f1f1f] text-[13px] font-mono font-medium text-[#0a0a0a] dark:text-white rounded-xl h-11 px-3 outline-none focus:ring-2 focus:ring-rose-500 w-full"';
const inputNew = 'className="h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-mono font-medium text-[#0a0a0a] shadow-sm outline-none transition hover:border-[#d4d4d8] focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-rose-500 dark:focus:ring-rose-500"';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replaceAll(selectOld, selectNew);
  content = content.replaceAll(textareaOld1, textareaNew1);
  content = content.replaceAll(textareaOld2, textareaNew2);
  content = content.replaceAll(textareaOld3, textareaNew3);
  content = content.replaceAll(inputOld, inputNew);
  fs.writeFileSync(filePath, content);
}

replaceInFile('components/settings/views/campaign-preferences.tsx');
replaceInFile('components/settings/views/language.tsx');
replaceInFile('components/settings/views/account-management.tsx');
