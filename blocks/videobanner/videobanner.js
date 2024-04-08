import {
  div,
  img,
  h1,
  p,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const anchorLink = block.querySelector('a');
  const titleText = block.children[4].children[1].textContent.trim();
  const description = block.children[5].children[1].textContent.trim();
  const posterImage = block.children[1].children[1].querySelector('img');
  const logoImage = block.children[2].children[1].querySelector('img');
  const bgImage = block.children[3].children[1].querySelector('img');
  const container = div(
    { class: 'listing-hero padding-btm wide-section', style: `--background-poster-image: url('${posterImage.src}')` },
    div(
      { class: 'outer' },
      img(
        {
          class: 'logo-25', src: logoImage.src, alt: 'logo-25',
        },
      ),
      div(
        { class: 'figure', style: `--background-arrow-image: url('${bgImage.src}')` },
        div(
          { class: 'text' },
          h1(titleText),
          p({ class: 'desktop-text' }, description),
        ),
      ),
    ),
  );
  const mobiTextContainer = div(
    { class: 'listing-hero-mobitext' },
    p(description),
  );
  const v = document.createElement('video');
  v.setAttribute('id', 'bgvideo');
  // Set the attributes of the video
  v.src = anchorLink;
  v.controls = false;
  v.autoplay = true;
  v.loop = true;
  v.muted = true;
  v.playsinline = true;
  v.poster = posterImage.src;
  container.appendChild(v);
  block.innerHTML = '';
  block.append(container);
  block.append(mobiTextContainer);
}
