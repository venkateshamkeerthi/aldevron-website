export default function buildAutoBlocks(block) {
  const landingSection = block.querySelector('.landing-section');

  function createAndAppendElement(className) {
    const element = document.createElement('div');
    element.classList.add(className);
    return element;
  }

  function extractAndClearFloatElements(className) {
    const childrenCopy = landingSection.cloneNode(true);
    const floatElements = [...childrenCopy.children].filter((child) => {
      const childElement = child.querySelector('.block');
      if (childElement.classList.contains(className)) {
        childElement.classList.remove(className);
        return true;
      }
      return false;
    });
    return floatElements;
  }

  function appendElementsToContainer(container, elements) {
    elements.forEach((element) => container.appendChild(element));
  }

  const clearFix = createAndAppendElement('clearfix');
  const floatLeftBlock = createAndAppendElement('float-left');
  const floatRightBlock = createAndAppendElement('float-right');

  const floatLeftElements = extractAndClearFloatElements('float-left');
  const floatRightElements = extractAndClearFloatElements('float-right');

  // Clear the landingSection
  landingSection.innerHTML = '';

  // Append 'float-left' elements first
  appendElementsToContainer(floatLeftBlock, floatLeftElements);

  // Append 'float-right' elements next
  appendElementsToContainer(floatRightBlock, floatRightElements);

  // Append clearFix
  landingSection.appendChild(floatLeftBlock);
  landingSection.appendChild(floatRightBlock);
  landingSection.appendChild(clearFix);
}
