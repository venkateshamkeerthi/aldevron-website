import {
  div, h2, li, ul, h3,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const clonedBlock = block.cloneNode(true);
  const wrapper = div({ class: 'wrapper' });
  [...clonedBlock.children].forEach((element) => {
    const lists = ul({ class: 'posts' });
    [...element.children].forEach((elementChild) => {
      let title = elementChild.querySelector('picture').parentElement.previousElementSibling;
      if (title) title = h2({ class: 'title' }, title.textContent);
      const showcaseBanner = li({ class: 'post' });
      const picElement = elementChild.querySelector('picture');
      const linkElement = elementChild.querySelector('a');
      if (linkElement.hasAttribute('title')) {
        linkElement.removeAttribute('title');
      }
      const ancButton = picElement.nextElementSibling;
      const description = picElement.parentElement.nextElementSibling;
      if (picElement) {
        const articleImage = document.createElement('a');
        articleImage.className = 'article-card-img';
        articleImage.append(picElement);
        articleImage.href = linkElement.href;
        if (title) {
          title.className = 'article-card-subtitle';
          showcaseBanner.append(title);
        }
        showcaseBanner.append(articleImage);
        const contentEle = div({ class: 'article-card-body' });
        if (ancButton) {
          const anchorSideLine = h3({ class: 'entry-title' });
          ancButton.className = 'redirect-link';
          anchorSideLine.append(ancButton);
          contentEle.append(anchorSideLine);
        }
        if (description) {
          description.className = 'description';
          contentEle.append(description);
        }
        showcaseBanner.append(contentEle);
      }
      lists.append(showcaseBanner);
    });
    wrapper.append(lists);
  });
  block.replaceChildren(wrapper);
}
