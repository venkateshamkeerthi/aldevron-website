/* eslint-disable no-unused-expressions */
import {
  div, ul, img, button,
} from '../../scripts/dom-builder.js';

class ModalImageSlider {
  constructor(block, data) {
    this.cardRenderer = this;

    // Set information
    this.block = block;
    this.data = data || [...block.children];
  }

  clickthumbnails() {
    const items = this.block.querySelectorAll('.hs-image__grid__list__item');
    items.forEach((item, idx) => {
      item.addEventListener('click', () => {
        this.createModal(items, item, idx);
        setTimeout(() => {
          requestAnimationFrame(() => {
            this.block
              .querySelector('.basicLightbox')
              .classList.add('basicLightbox--visible');
          });
        }, 100);
      });
    });
  }

  createModal(items, item, idx) {
    const prevEl = button(
      {
        class:
          'hs-image__grid__lightbox__button hs-image__grid__lightbox__button--prev',
      },
      '<',
    );
    const nextEl = button(
      {
        class:
          'hs-image__grid__lightbox__button hs-image__grid__lightbox__button--next',
      },
      '>',
    );
    const closeEl = button(
      { class: 'hs-image__grid__lightbox__button--close' },
      '✕',
    );
    idx === 0 && prevEl.classList.add('hs-image__grid__lightbox__button--hide');
    idx === items.length - 1
      && nextEl.classList.add('hs-image__grid__lightbox__button--hide');
    const imgsrc = item.querySelector('img').getAttribute('src');
    const shortImgSrc = imgsrc.split('?')[0];
    const imgEl = img({
      class: 'hs-image__grid__lightbox__image',
      src: shortImgSrc,
    });
    const modalEl = div(
      { class: 'basicLightbox' },
      div(
        { class: 'basicLightbox__placeholder' },
        div(
          { class: 'hs-image__grid__lightbox' },
          prevEl,
          imgEl,
          nextEl,
          closeEl,
        ),
      ),
    );
    this.block.append(modalEl);
    modalEl.addEventListener('click', () => {
      this.closeModal();
    });
    prevEl.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.closeModal();
      setTimeout(() => {
        this.createModal(items, item.previousElementSibling, idx - 1);
      }, 200);
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.block
            .querySelector('.basicLightbox')
            .classList.add('basicLightbox--visible');
        });
      }, 300);
    });
    nextEl.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.closeModal();
      setTimeout(() => {
        this.createModal(items, item.nextElementSibling, idx + 1);
      }, 200);
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.block
            .querySelector('.basicLightbox')
            .classList.add('basicLightbox--visible');
        });
      }, 300);
    });
    document.addEventListener('keydown', (event) => {
      const key = event;
      if (key.code === 'ArrowRight') {
        nextEl.focus();
      }
      if (key.code === 'ArrowLeft') {
        prevEl.focus();
      }
      // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    });
    nextEl.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = event;
      if (key.code === 'Enter') {
        this.closeModal();
        setTimeout(() => {
          this.createModal(items, item.nextElementSibling, idx + 1);
          this.block.querySelector('.hs-image__grid__lightbox__button--prev').focus();
        }, 200);
        setTimeout(() => {
          requestAnimationFrame(() => {
            this.block
              .querySelector('.basicLightbox')
              .classList.add('basicLightbox--visible');
          });
        }, 300);
      }
      if (key.code === 'Tab') {
        closeEl.focus();
      }
    });
    prevEl.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = event;
      if (key.code === 'Enter') {
        this.closeModal();
        setTimeout(() => {
          this.createModal(items, item.previousElementSibling, idx - 1);
          this.block.querySelector('.hs-image__grid__lightbox__button--next').focus();
        }, 200);
        setTimeout(() => {
          requestAnimationFrame(() => {
            this.block
              .querySelector('.basicLightbox')
              .classList.add('basicLightbox--visible');
          });
        }, 300);
      }
      if (key.code === 'Tab') {
        if (nextEl.classList.contains('hs-image__grid__lightbox__button--hide')) {
          closeEl.focus();
        } else {
          nextEl.focus();
        }
      }
    });
    closeEl.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = event;
      if (key.code === 'Enter') {
        this.closeModal();
      }
      if (key.code === 'Tab') {
        if (prevEl.classList.contains('hs-image__grid__lightbox__button--hide')) {
          nextEl.focus();
        } else {
          prevEl.focus();
        }
      }
    });
  }

  closeModal() {
    const modEl = this.block.querySelector(
      '.basicLightbox.basicLightbox--visible',
    );

    setTimeout(() => {
      requestAnimationFrame(() => {
        modEl && modEl.setAttribute('class', 'basicLightbox');
      });
    }, 10);
    setTimeout(() => {
      modEl && modEl.remove();
    }, 100);
  }

  // eslint-disable-next-line class-methods-use-this
  renderItem(item) {
    // create the modalimageslider content
    const columnContainer = document.createElement('button');
    columnContainer.classList.add('hs-image__grid__list__item__button');

    const itemChildren = [...item.children];
    itemChildren.forEach((itemChild) => {
      if (itemChild.querySelector('img')) {
        itemChild.classList.add('hs-image__grid__list__item__image');
        columnContainer.appendChild(itemChild);
      } else {
        itemChild.classList.add('hs-image__grid__item__overlay__content--fit');
        itemChild.setAttribute(
          'style',
          'white-space: normal;display: inline-block;font-size: 16px;font-weight: bold;',
        );
        const overlayEl = div(
          { class: 'hs-image__grid__item__overlay' },
          div({ class: 'hs-image__grid__item__overlay__content' }, itemChild),
        );
        columnContainer.appendChild(overlayEl);
      }
    });

    return columnContainer;
  }

  async render() {
    const listEl = ul({ class: 'hs-image__grid__list' });
    const contEl = div({ class: 'hs-image__grid__container' }, listEl);
    const wrapEl = div({ class: 'outer' }, contEl);

    this.data.forEach((item, index) => {
      const itemContainer = document.createElement('li');
      itemContainer.classList.add(
        'hs-image__grid__list__item',
        `modalimageslider-item-${index + 1}`,
      );

      let renderedItem = this.cardRenderer.renderItem(item);
      renderedItem = Array.isArray(renderedItem) ? renderedItem : [renderedItem];
      renderedItem.forEach((renderedItemElement) => {
        itemContainer.appendChild(renderedItemElement);
      });
      listEl.append(itemContainer);
    });
    this.block.innerHTML = '';
    this.block.append(wrapEl);
    this.clickthumbnails();
  }
}

/**
 * Create and render default modalimageslider.
 * Best practice: Create a new block and call the function, instead using or modifying this.
 * @param {Element}  block        required - target block
 * @param {Array}    data         optional - a list of data elements.
 *  either a list of objects or a list of divs.
 *  if not provided: the div children of the block are used
 * @param {Object}   config       optional - config object for
 * customizing the rendering and behaviour
 */
export async function createmodalimageslider(block, data, config) {
  const modalimageslider = new ModalImageSlider(block, data, config);
  await modalimageslider.render();
  return modalimageslider;
}

export default async function decorate(block) {
  // use the default modalimageslider
  await createmodalimageslider(block);
}
