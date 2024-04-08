function createShareButton(network, url, title) {
  const baseUrl = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  };

  const fullUrl = `${baseUrl[network]}${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;

  const listItem = document.createElement('li');
  listItem.className = 'hs-blog-social-share-item';
  const link = document.createElement('a');
  link.className = `hs-blog-social-share-item-link hs-blog-social-share-item-${network}`;
  link.href = fullUrl;
  link.ariaLabel = 'social share';
  const img = document.createElement('img');
  img.setAttribute('src', `/icons/${network}.svg`);
  const label = document.createElement('span');
  label.innerText = network === 'twitter' ? 'Tweet' : 'Share';
  link.appendChild(img);
  link.appendChild(label);
  listItem.appendChild(link);

  return listItem;
}

function renderShareButtons(container, url, title) {
  const networks = ['twitter', 'facebook', 'linkedin'];
  const list = document.createElement('ul');
  list.className = 'hs-blog-social-share-list';

  networks.forEach((network) => {
    const listItem = createShareButton(network, url, title);
    list.appendChild(listItem);
  });

  container.appendChild(list);
}

export default function decorate(block) {
  const title = block.querySelector('h1');
  const link = block.querySelector('a');
  const shareContainer = document.createElement('div');
  shareContainer.className = 'hs-blog-social-share';
  renderShareButtons(shareContainer, link.href, title.innerText);
  block.innerText = '';
  block.appendChild(shareContainer);
}
