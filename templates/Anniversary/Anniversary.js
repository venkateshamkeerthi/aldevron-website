function setSidebarMaxHeight() {
  let height = 0;
  const sidebar = document.querySelector('#sidebar');
  [...sidebar.children].forEach((element) => {
    height += element.offsetHeight;
  });
  sidebar.style.maxHeight = `${height + 50}px`;
}

function setSidebarHeight() {
  window.addEventListener('resize', setSidebarMaxHeight);
  window.addEventListener('click', setSidebarMaxHeight);
}

export default function buildAutoBlocks(block) {
  // const contentBlocks = block.querySelectorAll('.section');
  const sidebarSections = block.querySelector('.sidebar-section');

  // Creating the default template wrapper
  const defaultTemplate = document.createElement('div');
  defaultTemplate.id = 'content-wrapper';

  // Creating content wrapper
  const content = document.createElement('div');
  content.id = 'content';

  // Creating outer element
  const outerElement = document.createElement('div');
  outerElement.className = 'outer';

  // Creating main and sidebar elements
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';

  // Creating clearfix element
  const clearFix = document.createElement('div');
  clearFix.className = 'clearfix';

  outerElement.appendChild(main);
  outerElement.appendChild(sidebar);
  content.appendChild(outerElement);
  content.appendChild(clearFix);
  defaultTemplate.appendChild(content);
  // Iterate over each section
  if (sidebarSections.children.length > 0) {
    const sidebars = sidebarSections.querySelectorAll('[data-block-name^="sidebar-"]');
    if (sidebars.length > 0) {
      sidebars.forEach((sidebarItem) => {
        sidebar.appendChild(sidebarItem);
      });
    }
    Array.from(sidebarSections.cloneNode(true).children).forEach((child) => {
      main.appendChild(child);
    });
    sidebarSections.innerHTML = defaultTemplate.outerHTML;
  }
  const observer = new MutationObserver(() => {
    setSidebarMaxHeight();
  });

  observer.observe(sidebarSections, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  setSidebarMaxHeight();
  setSidebarHeight();
}
