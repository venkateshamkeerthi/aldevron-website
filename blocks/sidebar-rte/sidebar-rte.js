export default function decorate(block) {
  const images = block.querySelectorAll('picture');
  images.forEach((image) => {
    const { parentElement } = image;
    const { nextSibling } = parentElement;
    if (nextSibling) {
      const nextNextSibling = nextSibling.nextSibling;
      if (nextNextSibling) {
        const link = nextNextSibling.querySelector('a');
        if (link.href === link.innerText.trim()) {
          if (link.parentElement.tagName === 'STRONG') {
            link.setAttribute('target', '_blank');
          }
          link.innerHTML = '';
          link.appendChild(image.cloneNode(true));
          if (image.parentElement.tagName === 'P') {
            image.parentElement.remove();
          }
        }
        if (link && link.classList.contains('secondary')) {
          link.innerHTML = '';
          link.appendChild(image.cloneNode(true));
          if (image.parentElement.tagName === 'P') {
            image.parentElement.remove();
          }
        }
      }
    }
  });
}
