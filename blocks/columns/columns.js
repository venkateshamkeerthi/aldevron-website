export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  // set images hyperlink here
  const images = block.querySelectorAll('picture');
  images.forEach((image) => {
    const { nextSibling } = image;
    if (nextSibling.tagName === 'A' && nextSibling.href === nextSibling.innerText.trim()) {
      nextSibling.innerText = '';
      nextSibling.appendChild(image);
    }
  });
}
