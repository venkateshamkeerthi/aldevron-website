import { passFormMeetingConfig } from '../../scripts/aem.js';

function generateRandomId() {
  return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now().toString(36)}`;
}

export default function decorate(block) {
  const anchor = block.querySelector('a');
  const link = anchor.href || anchor.innerTet.trim();
  const blockId = generateRandomId();
  const hsCalendarBlock = document.createElement('div');
  hsCalendarBlock.id = blockId;
  hsCalendarBlock.style.width = '100%';
  hsCalendarBlock.style.minHeight = '400px';
  block.innerHTML = '';
  block.appendChild(hsCalendarBlock);
  passFormMeetingConfig({ blockId, link });
}
