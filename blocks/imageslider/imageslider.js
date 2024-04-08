/* eslint-disable no-unused-expressions */
import { decorateIcons } from '../../scripts/aem.js';
import { div, p } from '../../scripts/dom-builder.js';

const AUTOSCROLL_INTERVAL = 7000;

/**
 * Clone a imageslider item
 * @param {Element} item imageslider item to be cloned
 * @returns the clone of the imageslider item
 */
function createClone(item) {
  const clone = item.cloneNode(true);
  clone.classList.add('clone');
  clone.classList.remove('selected');

  return clone;
}

class ImageSlider {
  constructor(block, data, config) {
    // Set defaults
    this.cssFiles = [];
    this.defaultStyling = false;
    this.dotButtons = false;
    this.navButtons = true;
    this.counter = false;
    this.infiniteScroll = true;
    this.autoScroll = false; // only available with infinite scroll
    this.autoScrollInterval = AUTOSCROLL_INTERVAL;
    this.currentIndex = 0;
    this.counterText = '';
    this.counterNavButtons = true;
    this.cardRenderer = this;
    // this is primarily controlled by CSS,
    // but we need to know then intention for scrolling pourposes
    this.visibleItems = [
      {
        items: 1,
        condition: () => true,
      },
    ];

    // Set information
    this.block = block;
    this.data = data || [...block.children];

    // Will be replaced after rendering, if available
    this.navButtonLeft = null;
    this.navButtonRight = null;

    // Apply overwrites
    Object.assign(this, config);

    if (this.getCurrentVisibleItems() >= this.data.length) {
      this.infiniteScroll = false;
      this.navButtons = false;
      this.block.classList.add('fully-visible');
    }

    if (this.defaultStyling) {
      this.cssFiles.push('/blocks/imageslider/imageslider.css');
    }
  }

  getBlockPadding() {
    if (!this.blockStyle) {
      this.blockStyle = window.getComputedStyle(this.block);
    }
    return +(this.blockStyle.getPropertyValue('padding-left').replace('px', ''));
  }

  getMainBlockPadding() {
    if (!this.blockStyleMain) {
      this.blockStyleMain = window.getComputedStyle(this.block.parentElement.firstChild);
    }
    return +(this.blockStyleMain.getPropertyValue('padding-left').replace('px', ''));
  }

  updateCounterText(newIndex = this.currentIndex) {
    this.currentIndex = newIndex;
    if (this.counter) {
      const items = this.block.querySelectorAll('.imageslider-item:not(.clone,.skip)');
      const counterTextBlock = this.block.parentElement.querySelector('.imageslider-counter .imageslider-counter-text p');
      const pageCounter = `${this.currentIndex + 1} / ${items.length}`;
      counterTextBlock.innerHTML = this.counterText ? `${this.counterText} ${pageCounter}` : pageCounter;
    }
  }

  /**
  * Scroll the imageslider to the next item
  */
  nextItem() {
    !this.infiniteScroll && this.navButtonRight && this.navButtonRight.classList.remove('disabled');
    !this.infiniteScroll && this.navButtonLeft && this.navButtonLeft.classList.remove('disabled');

    const dotButtons = this.block.parentNode.querySelectorAll('.imageslider-dot-button');
    const items = this.block.querySelectorAll('.imageslider-item:not(.clone,.skip)');
    const selectedItem = this.block.querySelector('.imageslider-item.selected');
    const selectedItemMain = this.block.parentElement.firstChild.querySelector('.imageslider-item.selected');

    const itemsMain = this.block.parentElement.firstChild.querySelectorAll('.imageslider-item:not(.clone,.skip)');

    let index = [...items].indexOf(selectedItem);
    index = index !== -1 ? index : 0;

    const newIndex = (index + 1) % items.length;
    const newSelectedItem = items[newIndex];
    const newSelectedItemMain = itemsMain[newIndex];
    if (newIndex === 0 && !this.infiniteScroll) {
      return;
    }

    if (newIndex === items.length - this.getCurrentVisibleItems() && !this.infiniteScroll) {
      this.navButtonRight.classList.add('disabled');
    }

    if (newIndex === 0) {
      // create the ilusion of infinite scrolling
      newSelectedItem.parentNode.scrollTo({
        top: 0,
        left: (
          newSelectedItem.previousElementSibling.offsetLeft
          - this.getBlockPadding()
          - this.block.offsetLeft
        ),

      });

      newSelectedItemMain.parentNode.scrollTo({
        top: 0,
        left: (
          newSelectedItemMain.previousElementSibling.offsetLeft
           - this.getMainBlockPadding()
          - this.block.offsetLeft

        ),

      });
    }

    if (newIndex === 2) {
      selectedItemMain.previousElementSibling && selectedItemMain.previousElementSibling.removeAttribute('style');
    }

    newSelectedItem.parentNode.scrollTo({
      top: 0,
      left: newSelectedItem.offsetLeft - this.getBlockPadding() - this.block.offsetLeft,
      behavior: 'smooth',
    });

    newSelectedItemMain.parentNode.scrollTo({
      top: 0,
      left: newSelectedItemMain.offsetLeft
      - this.getMainBlockPadding()
      - this.block.offsetLeft,
      behavior: 'smooth',
    });

    items.forEach((item) => item.classList.remove('selected'));
    itemsMain.forEach((item) => item.classList.remove('selected'));
    dotButtons.forEach((item) => item.classList.remove('selected'));
    newSelectedItem.classList.add('selected');
    newSelectedItemMain.classList.add('selected');
    if (dotButtons && dotButtons.length !== 0) {
      dotButtons[newIndex].classList.add('selected');
    }

    this.updateCounterText(newIndex);
  }

  getCurrentVisibleItems() {
    return this.visibleItems
      .filter((e) => !e.condition || e.condition())[0].items;
  }

  /**
  * Scroll the imageslider to the previous item
  */
  prevItem() {
    !this.infiniteScroll && this.navButtonRight && this.navButtonRight.classList.remove('disabled');
    !this.infiniteScroll && this.navButtonLeft && this.navButtonLeft.classList.remove('disabled');

    const dotButtons = this.block.parentNode.querySelectorAll('.imageslider-dot-button');
    const items = this.block.querySelectorAll('.imageslider-item:not(.clone,.skip)');
    const selectedItem = this.block.querySelector('.imageslider-item.selected');
    const selectedItemMain = this.block.parentElement.firstChild.querySelector('.imageslider-item.selected');
    selectedItemMain.previousElementSibling && selectedItemMain.previousElementSibling.removeAttribute('style');

    const itemsMain = this.block.parentElement.firstChild.querySelectorAll('.imageslider-item:not(.clone,.skip)');

    let index = [...items].indexOf(selectedItem);
    index = index !== -1 ? index : 0;
    const newIndex = index - 1 < 0 ? items.length - 1 : index - 1;
    const newSelectedItem = items[newIndex];
    const newSelectedItemMain = itemsMain[newIndex];

    if (newIndex === items.length - 1 && !this.infiniteScroll) {
      return;
    }

    if (newIndex === 0 && !this.infiniteScroll) {
      this.navButtonLeft.classList.add('disabled');
    }

    if (newIndex === items.length - 1) {
      // create the ilusion of infinite scrolling
      newSelectedItem.parentNode.scrollTo({
        top: 0,
        left: (
          newSelectedItem.nextElementSibling.offsetLeft
          - this.getBlockPadding()
          - this.block.offsetLeft
        ),

      });

      newSelectedItemMain.parentNode.scrollTo({
        top: 0,
        left: (
          newSelectedItemMain.nextElementSibling.offsetLeft
          - this.getMainBlockPadding()
          - this.block.offsetLeft
        ),

      });
    }

    newSelectedItem.parentNode.scrollTo({
      top: 0,
      left: newSelectedItem.offsetLeft - this.getBlockPadding() - this.block.offsetLeft,
      behavior: 'smooth',
    });

    newSelectedItemMain.parentNode.scrollTo({
      top: 0,
      left: newSelectedItemMain.offsetLeft - this.getMainBlockPadding() - this.block.offsetLeft,
      behavior: 'smooth',
    });

    items.forEach((item) => item.classList.remove('selected'));
    itemsMain.forEach((item) => item.classList.remove('selected'));
    dotButtons.forEach((item) => item.classList.remove('selected'));
    newSelectedItem.classList.add('selected');
    newSelectedItemMain.classList.add('selected');
    if (dotButtons && dotButtons.length !== 0) {
      dotButtons[newIndex].classList.add('selected');
    }

    this.updateCounterText(newIndex);
  }

  /**
  * Create clone items at the beginning and end of the imageslider
  * to give the appearance of infinite scrolling
  */
  createClones() {
    if (this.block.children.length < 3) return;

    const initialChildren = [...this.block.children];

    this.block.parentElement.firstChild.lastChild.after(createClone(initialChildren[0]));
    this.block.parentElement.firstChild.firstChild
      .before(createClone(initialChildren[initialChildren.length - 1]));

    this.block.lastChild.after(createClone(initialChildren[0]));
    this.block.lastChild.after(createClone(initialChildren[1]));
    this.block.lastChild.after(createClone(initialChildren[2]));

    this.block.firstChild.before(createClone(initialChildren[initialChildren.length - 1]));
    this.block.firstChild.before(createClone(initialChildren[initialChildren.length - 2]));
    this.block.firstChild.before(createClone(initialChildren[initialChildren.length - 3]));
  }

  /**
  * Create left and right arrow navigation buttons
  */
  createNavButtons(parentElement) {
    const buttonLeft = document.createElement('a');
    buttonLeft.classList.add('imageslider-nav-left');
    buttonLeft.classList.add('imageslider-nav-button');
    buttonLeft.ariaLabel = 'Scroll to previous item';
    buttonLeft.innerText = '<';
    buttonLeft.addEventListener('click', () => {
      clearInterval(this.intervalId);
      this.prevItem();
    });

    if (!this.infiniteScroll) {
      buttonLeft.classList.add('disabled');
    }

    const buttonRight = document.createElement('a');
    buttonRight.classList.add('imageslider-nav-right');
    buttonRight.classList.add('imageslider-nav-button');
    buttonRight.ariaLabel = 'Scroll to next item';
    buttonRight.innerText = '>';
    buttonRight.addEventListener('click', () => {
      clearInterval(this.intervalId);
      this.nextItem();
    });

    [buttonLeft, buttonRight].forEach((navButton) => {
      navButton.classList.add('imageslider-nav-button');
      parentElement.append(navButton);
    });

    decorateIcons(buttonLeft);
    decorateIcons(buttonRight);
    this.navButtonLeft = buttonLeft;
    this.navButtonRight = buttonRight;
  }

  /**
  * Adds event listeners for touch UI swiping
  */
  addSwipeCapability() {
    if (this.block.swipeCapabilityAdded) {
      return;
    }

    let touchstartX = 0;
    let touchendX = 0;

    this.block.addEventListener('touchstart', (e) => {
      touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.block.addEventListener('touchend', (e) => {
      touchendX = e.changedTouches[0].screenX;
      if (Math.abs(touchendX - touchstartX) < 10) {
        return;
      }

      if (touchendX < touchstartX) {
        clearInterval(this.intervalId);
        this.nextItem();
      }

      if (touchendX > touchstartX) {
        clearInterval(this.intervalId);
        this.prevItem();
      }
    }, { passive: true });
    this.block.swipeCapabilityAdded = true;
  }

  setInitialScrollingPosition() {
    const scrollToSelectedItem = () => {
      const item = this.block.querySelector('.imageslider-item.selected');
      item.parentNode.scrollTo({
        top: 0,
        left: item.offsetLeft - this.getBlockPadding() - this.block.offsetLeft,
      });
    };
    setTimeout(scrollToSelectedItem, 10);
  }

  setInitialScrollingPositionMain() {
    const scrollToSelectedItemMain = () => {
      const item = this.block.parentElement.firstChild.querySelector('.imageslider-item.selected');
      item.parentNode.scrollTo({
        top: 0,
        left: item.offsetLeft - this.getMainBlockPadding() - this.block.offsetLeft,
      });
    };
    setTimeout(scrollToSelectedItemMain, 10);
  }

  createDotButtons() {
    const buttons = document.createElement('div');
    buttons.className = 'imageslider-dot-buttons';
    const items = [...this.block.children];

    items.forEach((item, i) => {
      const button = document.createElement('button');
      button.ariaLabel = `Scroll to item ${i + 1}`;
      button.classList.add('imageslider-dot-button');
      if (i === this.currentIndex) {
        button.classList.add('selected');
      }

      button.addEventListener('click', () => {
        clearInterval(this.intervalId);
        this.block.scrollTo({
          top: 0,
          left: item.offsetLeft - this.getBlockPadding(),
          behavior: 'smooth',
        });
        [...buttons.children].forEach((r) => r.classList.remove('selected'));
        items.forEach((r) => r.classList.remove('selected'));
        button.classList.add('selected');
        item.classList.add('selected');
        this.updateCounterText(i);
      });
      buttons.append(button);
    });
    this.block.parentElement.append(buttons);
  }

  clickthumbnails() {
    const items = [...this.block.children];
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const selectedItem = this.block.querySelector('.imageslider-item.selected');
        if (item.classList.toString()
        === selectedItem.previousElementSibling.classList.toString()) {
          this.prevItem();
        } else if (item.classList.toString()
        === selectedItem.previousElementSibling.previousElementSibling.classList.toString()) {
          this.prevItem();
          this.prevItem();
        } else if (item.classList.toString()
        === selectedItem.nextElementSibling.classList.toString()) {
          this.nextItem();
        } else if (item.classList.toString()
        === selectedItem.nextElementSibling.nextElementSibling.classList.toString()) {
          this.nextItem();
          this.nextItem();
        }
      });
    });
  }

  setSliderWidth() {
    const deviceWidth = window.innerWidth;
    if (deviceWidth < 1024) {
      const imgWidth = Math.ceil((deviceWidth - 80) / 4);
      this.block.querySelectorAll('.imageslider-item').forEach((item) => {
        item.setAttribute('style', `width:${imgWidth}px;`);
      });
    } else {
      this.block.querySelectorAll('.imageslider-item').forEach((item) => {
        item.setAttribute('style', 'width:250px;');
      });
    }
  }

  createCounter() {
    const counter = div(
      { class: 'imageslider-counter' },
      div(
        { class: 'imageslider-counter-text' },
        p(''),
      ),
    );
    if (this.counterNavButtons) {
      this.createNavButtons(counter);
    }
    this.block.parentElement.append(counter);
    this.updateCounterText();
  }

  /*
  * Changing the default rendering may break imagesliders that rely on it
  * (e.g. CSS might not match anymore)
  */
  // eslint-disable-next-line class-methods-use-this
  renderItem(item) {
    // create the imageslider content
    const columnContainer = document.createElement('div');
    columnContainer.classList.add('imageslider-item-columns-container');

    const columns = [document.createElement('div'), document.createElement('div')];

    const itemChildren = [...item.children];
    itemChildren.forEach((itemChild, idx) => {
      if (itemChild.querySelector('img')) {
        itemChild.querySelector('img').setAttribute('title', itemChild.querySelector('img').getAttribute('alt'));
        itemChild.classList.add('imageslider-item-image');
      } else {
        itemChild.classList.add('imageslider-item-text');
      }
      columns[idx].appendChild(itemChild);
    });

    columns.forEach((column) => {
      column.classList.add('imageslider-item-column');
      columnContainer.appendChild(column);
    });
    return columnContainer;
  }

  async render() {
    // copy imageslider styles to the wrapper too
    this.block.parentElement.classList.add(
      ...[...this.block.classList].filter((item, idx) => idx !== 0 && item !== 'block'),
    );

    // this.block.parentElement.classList.add('outer');
    this.block.innerHTML = '';
    const mainContainer = document.createElement('div');
    mainContainer.classList.add('imageslider-main');
    this.block.parentElement.prepend(mainContainer);

    this.data.forEach((item, index) => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add('imageslider-item', `imageslider-item-${index + 1}`);

      let renderedItem = this.cardRenderer.renderItem(item);
      renderedItem = Array.isArray(renderedItem) ? renderedItem : [renderedItem];
      renderedItem.forEach((renderedItemElement) => {
        // There may be items in the imageslider that are skipped from scrolling
        if (renderedItemElement.classList.contains('imageslider-skip-item')) {
          itemContainer.classList.add('skip');
        }
        itemContainer.appendChild(renderedItemElement);
      });
      const mainClone = itemContainer.cloneNode(true);
      mainContainer.appendChild(mainClone);
      this.block.appendChild(itemContainer);
    });

    // set initial selected imageslider item
    const activeItems = this.block.querySelectorAll('.imageslider-item:not(.clone,.skip)');
    activeItems[this.currentIndex].classList.add('selected');

    const activeMainItems = this.block.parentElement.firstChild.querySelectorAll('.imageslider-item:not(.clone,.skip)');
    activeMainItems[this.currentIndex].classList.add('selected');

    this.dotButtons && this.createDotButtons();
    this.counter && this.createCounter();
    this.navButtons && this.createNavButtons(this.block.parentElement);
    this.infiniteScroll && this.createClones();
    this.infiniteScroll && this.setInitialScrollingPosition();
    this.clickthumbnails();
    this.setSliderWidth();
    this.setInitialScrollingPositionMain();
    window.addEventListener('resize', () => {
      this.setSliderWidth();
      this.setInitialScrollingPositionMain();
      this.setInitialScrollingPosition();
    });
  }
}

/**
 * Create and render default imageslider.
 * Best practice: Create a new block and call the function, instead using or modifying this.
 * @param {Element}  block        required - target block
 * @param {Array}    data         optional - a list of data elements.
 *  either a list of objects or a list of divs.
 *  if not provided: the div children of the block are used
 * @param {Object}   config       optional - config object for
 * customizing the rendering and behaviour
 */
export async function createimageslider(block, data, config) {
  const imageslider = new ImageSlider(block, data, config);
  await imageslider.render();
  return imageslider;
}

export default async function decorate(block) {
  // use the default imageslider
  await createimageslider(block);
}
