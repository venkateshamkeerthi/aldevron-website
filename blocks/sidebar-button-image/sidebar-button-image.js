export default function decorate(block) {
  const link = block.querySelector('a');
  const image = block.querySelector('picture');
  if (link && image) { // Corrected the logical operator from '&' to '&&'
    link.innerText = '';
    link.className = 'cta_button cta_button_img';
    link.appendChild(image.cloneNode(true)); // Use cloneNode to append a copy of the image
  }
  block.innerText = '';
  block.appendChild(link);
}
