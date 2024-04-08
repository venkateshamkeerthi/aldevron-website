import {
  div, p, a, h4,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const cName = block.className;
  const col3El = div({ class: 'module mmg-rich-cols cols3-row' });
  const col2El = div({ class: 'module mmg-rich-cols cols2-row half' });
  const col3wrap = div(
    {
      class: 'hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_custom_widget',
    },
    col3El,
  );

  const col2wrap = div(
    {
      class: 'hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_custom_widget',
    },
    col2El,
  );

  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index) => {
      const pic = col.querySelector('picture');
      const pEl = p();
      const colEl = div({ class: `col${index + 1}` }, pEl);
      const coltextEl = div({ class: `col${index + 1}` });

      if (pic) {
        const aEl = col.querySelector('a');
        if (aEl) {
          const h4El = h4({ style: 'text-align: center;' }, aEl);

          aEl.removeAttribute('class');
          if (cName.includes('3col-img-link')) {
            const ahrefEl = a(
              { href: aEl.getAttribute('href'), target: '_blank' },
              pic,
            );
            pEl.append(ahrefEl); col3El.append(colEl);
          } else if (cName.includes('3col-img-text-top')) {
            coltextEl.append(h4El);
            const ahrefEl = a(
              { href: aEl.getAttribute('href'), target: '_blank' },
              pic,
            );
            pEl.append(ahrefEl);
            coltextEl.append(pEl);
            col3El.append(coltextEl);
          } else if (cName.includes('2col-img-text-bottom')) {
            const ahrefEl = a(
              { href: aEl.getAttribute('href'), target: '_blank' },
              pic,
            );

            coltextEl.append(ahrefEl);
            coltextEl.append(h4El);
            col2El.append(coltextEl);
          }
        }
      }
    });
  });
  block.textContent = '';
  if (cName.includes('3col-img')) {
    col3El
      .querySelectorAll('img')
      .forEach((img) => {
        img.setAttribute('style', 'width:200px;display:block;margin:0px auto;');
        img.setAttribute('loading', 'lazy');
      });
    block.append(col3wrap);
  } else if (cName.includes('2col-img')) {
    col2El
      .querySelectorAll('img')
      .forEach((img) => {
        img.setAttribute('style', 'width:200px;display:block;margin:0px auto;');
        img.setAttribute('loading', 'lazy');
      });
    block.append(col2wrap);
  }
}
