export default function decorate(block) {
  const anchorLink = block.querySelector('a');
  const ifrmContainer = document.createElement('div');
  ifrmContainer.classList.add('responsive-embed');
  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('src', anchorLink);
  ifrm.style.frameBorder = '0';
  ifrm.style.allow = 'autoplay; fullscreen; picture-in-picture';
  ifrm.setAttribute('allowFullScreen', '');
  ifrmContainer.appendChild(ifrm);
  block.innerHTML = '';
  block.append(ifrmContainer);
}
