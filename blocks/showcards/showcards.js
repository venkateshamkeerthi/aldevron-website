import {
  div, h2, h3, li, p, ul,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const checkServiceSection = block.classList.contains('data-block-heading-services');
  block.className += checkServiceSection ? ' module mmg-rich-columns padding-all wide-section center shift-top style-icons'
    : 'module mmg-rich-columns padding-all custom-bg wide-section center style-icons';
  const clondBlock = block.cloneNode(true);
  const dataHeading = block.className.split(' ').filter((y) => y.includes('data-block-heading-'));
  const wrapper = div({ class: 'outer' });
  if (dataHeading.length > 0) wrapper.append(h2({ class: 'module-title align-center' }, dataHeading[0].replace('data-block-heading-', '')));
  const lists = ul({ class: 'content flex cols3' });
  [...clondBlock.children].forEach((element) => {
    const picElement = element.querySelector('picture');
    picElement.className = 'media img';
    const ancButton = element.querySelector('p.button-container');
    const showcaseBanner = li({ class: 'col with-cta' }, picElement);
    const contentEle = div({ class: 'card-body' });
    if (ancButton.previousElementSibling && ancButton.previousElementSibling.previousElementSibling && ancButton.previousElementSibling.previousElementSibling.textContent !== '') {
      const title = h3({ class: 'title' }, ancButton.previousElementSibling.previousElementSibling.textContent);
      contentEle.append(title);
    }
    if (ancButton.previousElementSibling && ancButton.previousElementSibling.textContent !== '') {
      const description = p({ class: 'description' }, ancButton.previousElementSibling.textContent);
      contentEle.append(description);
    }
    showcaseBanner.append(contentEle);
    if (ancButton.children.length > 0) {
      const cardFooter = div({ class: 'actions' }, ancButton.children[0]);
      showcaseBanner.append(cardFooter);
    }
    lists.append(showcaseBanner);
  });
  wrapper.append(lists);
  block.replaceChildren(wrapper);
}
