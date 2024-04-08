import { readBlockConfig, decorateIcons } from '../../scripts/aem.js';
/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  function createDivElement(className, IDName) {
    const divEl = document.createElement('div');
    divEl.setAttribute('class', className);
    divEl.setAttribute('id', IDName);
    return divEl;
  }
  function addClassesToListItems(element, depth) {
    for (let i = 0; i < element.length; i += 1) {
      const item = element[i];
      item.classList.add('hs-menu-item', `hs-menu-depth-${depth}`, 'hs-item-has-children', `menu-num-${i + 1}`);
      const childItems = item.querySelector('ul');
      if (childItems?.children?.length > 0) {
        addClassesToListItems(childItems.children, depth + 1);
      }
    }
  }
  function callSocialIcons(socialIcons) {
    const allAnchorTags = createDivElement('social-icons', '');
    for (let i = 0; i < socialIcons.children.length; i += 1) {
      const createAtag = document.createElement('a');
      createAtag.appendChild(socialIcons.children[i]?.children[0]?.querySelector('picture'));
      createAtag.setAttribute('href', socialIcons.children[i]?.children[1]?.children[0].href);
      createAtag.setAttribute('target', '_blank');
      createAtag.setAttribute('aria-label', 'Social Media Link');
      allAnchorTags.appendChild(createAtag);
    }
    return allAnchorTags;
  }
  if (resp.ok) {
    const html = await resp.text();
    const topContainer = createDivElement('top-container', '');
    const footerOrangeSection = createDivElement('', 'footer-orange');
    const footerParent = createDivElement('outer', '');
    const footerWapper = createDivElement('hs-menu-wrapper active-branch flyouts hs-menu-flow-horizontal', 'hs_menu_wrapper_footer_nav');
    const footerUl = createDivElement('outer', 'footer-black');
    footerUl.innerHTML = html;
    footerWapper.append(footerUl.querySelector('ul'));
    footerOrangeSection.append(footerParent);
    topContainer.append(footerOrangeSection);
    footerParent.append(footerWapper);
    const childItems = footerWapper.children[0].children;
    // const childImage = childItems[5]
    // footerWapper.append(footerUl)
    addClassesToListItems(childItems, 1);
    footerParent.append(callSocialIcons(footerUl.children[0].children[0]));
    footerParent.append(footerUl);
    const footLogo = document.createElement('a');
    footLogo.id = 'footLogo';
    footLogo.target = '_blank';
    footLogo.ariaLabel = 'Danaher Logo';
    // footLogo.href = '';
    // footLogo.innerHTML = footerUl.children[0].children[2].innerHTML;

    footLogo.append(footerUl.children[0]?.children[1]?.children[0]?.children[0]?.querySelector('picture'));
    footLogo.href = footerUl.children[0]?.children[1]?.children[0]?.children[1]?.children[0]?.href;

    footerUl.children[0].children[1].replaceWith(footLogo);
    topContainer.append(footerUl);
    const links = footerWapper.querySelectorAll('a');
    links.forEach((link) => {
      if (link.parentElement.tagName === 'STRONG') {
        link.setAttribute('target', '_blank');
        link.classList.add('text-normal');
      }
    });
    decorateIcons(footerWapper);
    block.append(topContainer);
  }
}
