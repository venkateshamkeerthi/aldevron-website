export default function decorate(block) {
  const quoteWrapper = document.createElement('div');
  quoteWrapper.classList.add('quote-wrapper');
  [...block.children].forEach((element) => { quoteWrapper.append(element); });
  quoteWrapper.children[1].classList.add('details');
  quoteWrapper.children[2].classList.add('title');
  block.textContent = '';
  block.append(quoteWrapper);
  if (quoteWrapper.children[3] && quoteWrapper.children[3].querySelector('picture')) {
    quoteWrapper.children[3].classList.add('testimonial-headshot');
    quoteWrapper.classList.add('bottom-icon');
    block.appendChild(quoteWrapper.children[3]);
  }
}
