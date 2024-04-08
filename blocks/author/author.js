import {
  div, button,
} from '../../scripts/dom-builder.js';

function removeActiveClasses(content) {
  const contentElements = content.querySelectorAll('.tabpanel');
  [...contentElements].forEach((element) => {
    element.classList.remove('active');
  });
  const listElements = content.querySelectorAll('button');
  [...listElements].forEach((element) => {
    element.classList.remove('active');
  });
}

function activeFirstElements(content) {
  const contentElement = content.querySelector('.tabpanel');
  contentElement.classList.add('active');
  const listElement = content.querySelector('button');
  listElement.classList.add('active');
}

function makeAuthorBlock(elements) {
  const authorBlock = document.createElement('div');
  authorBlock.className = 'author-block';

  if (elements.querySelector('picture')) {
    const imgDiv = document.createElement('div');
    const AnchorTag = elements.querySelector('a');
    const copyTag = AnchorTag.cloneNode(true);
    imgDiv.appendChild(copyTag);
    copyTag.innerText = '';
    imgDiv.className = 'author-avatar';
    const img = elements.querySelector('picture');
    copyTag.appendChild(img.cloneNode(true));
    authorBlock.appendChild(imgDiv);
  }

  const contentDiv = document.createElement('div');
  contentDiv.className = 'author-info';
  const remainingContent = elements.cloneNode(true);
  if (remainingContent.querySelector('picture')) {
    remainingContent.querySelector('picture').remove();
    contentDiv.classList.add('has-avatar');
  }
  contentDiv.appendChild(remainingContent);
  authorBlock.appendChild(contentDiv);

  return authorBlock;
}

async function fetchBlogData() {
  try {
    const response = await fetch('/query-index.json');
    const jsonData = await response.json();
    return jsonData.data;
  } catch (error) {
    return [];
  }
}

function createArticleList(articles) {
  const ul = document.createElement('ul');

  articles.forEach((article) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const date = new Date(Number(article.date) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    link.href = article.path;
    link.textContent = article.title;
    const span = document.createElement('span');
    span.className = 'date';
    span.innerText = ` - ${date}`;
    li.appendChild(link);
    li.appendChild(span);
    ul.appendChild(li);
  });

  return ul;
}

async function getLatestPosts(authorUrl) {
  const searchParams = new URLSearchParams(authorUrl.split('?')[1]);
  let finalArticles = [];

  try {
    const data = await fetchBlogData();
    const filteredResults = data.filter((item) => {
      const path = item.path.toLowerCase();
      const regex = /^\/blog\/.+/;
      return regex.test(path);
    });

    if (searchParams.has('author')) {
      const author = searchParams.get('author');
      finalArticles = filteredResults.filter(
        (art) => art.author.toLowerCase() === author.toLowerCase(),
      );
    }
  } catch (error) {
    return '';
  }
  return createArticleList(finalArticles);
}

export default async function decorate(block) {
  const tabComponent = document.createElement('div');
  tabComponent.className = 'mmg-tabs';
  const ul = document.createElement('div');
  ul.className = 'tablist';
  const tabContent = document.createElement('div');
  tabContent.className = 'tabpanels';
  [...block.children].forEach((row) => {
    const itemContent = makeAuthorBlock(row.children[1]);
    itemContent.id = 'author-profile';
    itemContent.className = 'tabpanel';
    const li = document.createElement('button');
    li.className = 'tab';
    li.appendChild(row.children[0]);

    li.addEventListener('click', () => {
      removeActiveClasses(tabComponent);
      li.classList.add('active');
      itemContent.classList.add('active');
    });
    ul.appendChild(li);
    tabContent.appendChild(itemContent);
  });

  const latestPostTab = button({ class: 'tab', id: 'latest-post' }, div('LATEST POSTS'));

  ul.appendChild(latestPostTab);
  const latestPostContent = div({ class: 'tabpanel', id: 'latest-post-panel' });
  const authorUrl = block.querySelector('a').href;
  const tabList = await getLatestPosts(authorUrl);
  latestPostContent.appendChild(tabList);
  tabContent.appendChild(latestPostContent);
  latestPostTab.addEventListener('click', () => {
    removeActiveClasses(tabComponent);
    latestPostTab.classList.add('active');
    latestPostContent.classList.add('active');
  });
  block.textContent = '';
  tabComponent.appendChild(ul);
  tabComponent.appendChild(tabContent);
  block.appendChild(tabComponent);
  activeFirstElements(tabComponent);
}
