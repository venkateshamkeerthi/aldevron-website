function extractContainerId(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  return params.get('container_id');
}

export default function decorate(block) {
  const anchorLink = block.querySelector('a').href;
  const containerId = extractContainerId(anchorLink);
  const divElement = document.createElement('div');
  divElement.setAttribute('id', containerId);
  const scriptTag = document.createElement('script');
  scriptTag.src = anchorLink;
  divElement.appendChild(scriptTag);
  block.innerHTML = '';
  block.append(divElement);
}
