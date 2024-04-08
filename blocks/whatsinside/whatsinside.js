import { div, h2 } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const picEle = block.querySelector('img');
  const src = picEle.getAttribute('src');
  const headingDiv = document.createElement('div');
  const wrapper = div({ class: 'wrapper' });
  [...block.children].forEach((element, index) => {
    if (index === 0) {
      const enablement = h2({ class: 'element' }, element.textContent);
      headingDiv.append(enablement);
    } else if (index !== 1) {
      const imgDiv = document.createElement('div');
      const image = document.createElement('img');
      image.setAttribute('src', src);
      imgDiv.appendChild(image);
      imgDiv.classList.add('whats-inside_block-image');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('whats-inside_block-content');
      contentDiv.append(element);
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('whats-inside_block');
      mainDiv.append(imgDiv);
      mainDiv.append(contentDiv);
      wrapper.append(mainDiv);
    }
  });
  block.innerText = '';
  block.appendChild(headingDiv);
  block.appendChild(wrapper);
}
