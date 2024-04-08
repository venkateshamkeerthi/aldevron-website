import {
  a,
  div,
  span,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const image = block.querySelector('picture');
  const anchorLink = block.querySelector('a');
  const bodytext = block.children[1].textContent.trim();
  const container = div(
    { class: 'linkedin-bottom padding-btm' },
    div(
      { class: 'outer' },
      a(
        {
          class: 'text-link', href: anchorLink.href, title: anchorLink.title, 'aria-label': anchorLink.title, target: '_blank',
        },
        image,
        span({ class: 'text' }, bodytext),
        span({ class: 'btn' }, anchorLink.textContent),
      ),
    ),
  );
  block.innerHTML = '';
  block.append(container);
}
