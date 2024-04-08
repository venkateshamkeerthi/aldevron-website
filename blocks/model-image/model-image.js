// creating the elements with class names
const creteEleAddCls = (obj) => {
  const { classes } = obj;
  let { targetEle } = obj;
  targetEle = document.createElement(targetEle);
  if (classes && classes.length > 0) {
    targetEle.classList.add(...classes);
  }
  return targetEle;
};
// Adding the inline-styles for the element
const addStyles = (ele, styles) => {
  Object.entries(styles).forEach(([key, value]) => {
    ele.style[key] = value;
  });
};

// Setting the attributes for the element
const setAttributes = (ele, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    ele.setAttribute(key, value);
  });
};

export default function decorate(block) {
  const imgWrap = creteEleAddCls({ targetEle: 'div', classes: ['img-colorbox-popup', 'cboxElement'] });
  const pictureTag = block.querySelector('picture');
  pictureTag.parentElement.remove();
  const pictureTagForZoom = pictureTag.cloneNode(true);
  addStyles(pictureTagForZoom, { cursor: 'pointer' });
  imgWrap.append(pictureTag);
  imgWrap.classList.add('image-wrapper');
  block.append(imgWrap);
  const overlayDiv = creteEleAddCls({ targetEle: 'div', classes: [] });
  addStyles(overlayDiv, {
    display: 'none',
    cursor: 'pointer',
    visibility: 'visible',
  });
  setAttributes(overlayDiv, {
    id: 'cboxOverlay',
  });
  block.appendChild(overlayDiv);

  const colorboxWrapper = creteEleAddCls({ targetEle: 'div', classes: ['colorbox-wrapper'] });
  const colorboxDiv = creteEleAddCls({ targetEle: 'div', classes: [] });
  setAttributes(colorboxDiv, {
    id: 'colorbox',
    role: 'dialog',
    tabindex: '-1',
  });
  addStyles(colorboxDiv, {
    display: 'none',
    visibility: 'visible',
  });

  colorboxWrapper.append(colorboxDiv);
  overlayDiv.appendChild(colorboxWrapper);
  const pictureWrapperDiv = creteEleAddCls({ targetEle: 'div', classes: ['picture-wrapper'] });
  const pictureOverflowWrapperDiv = creteEleAddCls({ targetEle: 'div', classes: ['picture-overflow-wrap'] });
  pictureOverflowWrapperDiv.append(pictureTagForZoom);
  pictureWrapperDiv.append(pictureOverflowWrapperDiv);
  colorboxDiv.append(pictureWrapperDiv);
  const cboxWrapperSecondChildCboxbtnIconSearch = creteEleAddCls({ targetEle: 'span', classes: ['button', 'icon-search'] });
  const cboxWrapperSecondChildCboxCloseBtn = creteEleAddCls({ targetEle: 'button', classes: [] });
  setAttributes(cboxWrapperSecondChildCboxCloseBtn, {
    id: 'cboxClose',
    type: 'button',
  });
  cboxWrapperSecondChildCboxCloseBtn.innerHTML = '&#215';
  colorboxDiv.append(cboxWrapperSecondChildCboxCloseBtn);
  colorboxDiv.append(cboxWrapperSecondChildCboxbtnIconSearch);
  block.querySelector('.img-colorbox-popup.cboxElement').addEventListener('click', (e) => {
    e.stopPropagation();
    addStyles(overlayDiv, {
      display: 'flex',
      cursor: 'pointer',
      visibility: 'visible',
    });
    addStyles(colorboxDiv, {
      display: 'block',
      visibility: 'visible',
      'z-index': '9999',
      'background-color': 'white',
      padding: '15px',
    });
  });
  cboxWrapperSecondChildCboxCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addStyles(overlayDiv, {
      display: 'none',
    });
    addStyles(colorboxDiv, {
      display: 'none',
    });
    addStyles(pictureTagForZoom.querySelector('img'), { 'max-width': '100%' });
    addStyles(cboxWrapperSecondChildCboxbtnIconSearch, { display: 'block' });
  });
  overlayDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    addStyles(overlayDiv, {
      display: 'none',
    });
    addStyles(colorboxDiv, {
      display: 'none',
    });
    addStyles(pictureTagForZoom.querySelector('img'), { 'max-width': '100%' });
    addStyles(cboxWrapperSecondChildCboxbtnIconSearch, { display: 'block' });
  });
  pictureTagForZoom.addEventListener('click', (e) => {
    e.stopPropagation();
    addStyles(pictureTagForZoom.querySelector('img'), { 'max-width': '200%' });
    addStyles(cboxWrapperSecondChildCboxbtnIconSearch, { display: 'none' });
  });
  block.querySelector('.button.icon-search').addEventListener('click', (e) => {
    e.stopPropagation();
    addStyles(pictureTagForZoom.querySelector('img'), { 'max-width': '200%' });
    addStyles(cboxWrapperSecondChildCboxbtnIconSearch, { display: 'none' });
  });
}
