import {
  div, article, p, a, img, h1, h4, h3,
} from '../../scripts/dom-builder.js';

import { capitalizeWords, getMetadata } from '../../scripts/aem.js';

let sideBarVisible = false;

function createSidebar(head, items, displayLimit) {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar-block';
  const heading = h3(`${head}s`);
  const ul = document.createElement('ul');
  let itemCount = 0;
  items.forEach(({ title, count }) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = `${title} (${count})`;
    link.setAttribute('href', `/about-us/news/?${head.toLowerCase()}=${title.replace(' ', '-')}`);
    li.appendChild(link);
    ul.appendChild(li);
    itemCount += 1;
    if (itemCount > displayLimit) {
      li.style.display = 'none';
    }
  });

  sidebar.appendChild(heading);
  sidebar.appendChild(ul);

  if (itemCount > displayLimit) {
    const seeMoreButton = document.createElement('a');
    seeMoreButton.classList.add('cursor');
    seeMoreButton.textContent = 'See More';
    seeMoreButton.addEventListener('click', () => {
      ul.querySelectorAll('li').forEach((li, index) => {
        if (index >= displayLimit) {
          li.style.display = 'block';
        }
      });
      seeMoreButton.style.display = 'none';
    });

    sidebar.appendChild(seeMoreButton);
  }
  return sidebar;
}

function generateArchiveBlock(results) {
  const dates = results.reduce((acc, arc) => {
    const date = new Date(Number(arc.date) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!(date in acc)) {
      acc[date] = 1;
    } else {
      acc[date] += 1;
    }
    return acc;
  }, {});
  const archiveResults = Object.entries(dates).map(([title, count]) => ({ title, count }));
  return createSidebar('Archive', archiveResults, 10);
}

function generateTopicBlock(results) {
  const tagCounts = {};
  results.forEach((arc) => {
    JSON.parse(arc.tags).forEach((tag) => {
      tagCounts[tag.trim()] = (tagCounts[tag.trim()] || 0) + 1;
    });
  });
  const tagCArray = Object.entries(tagCounts).map(([tag, count]) => ({ title: tag.trim(), count }));
  return createSidebar('Topic', tagCArray, 10);
}

function generateResultsBlock(articles, currentPage, totalArticles) {
  const articleElements = articles.map((art) => article(
    { class: `${art.image ? 'post-item post-has-img clearfix' : 'post-item clearfix'}` },
    art.image
      ? div({ class: 'post-image ' }, a(
        { href: art.path },
        img({
          src: art.image, width: '30%', height: '100%', alt: '',
        }),
      )) : '',
    div(
      { class: 'post-content' },
      h1({ class: 'post-title' }, a({ href: art.path }, capitalizeWords(art['page-title']))),
      div(
        { class: 'post-meta' },
        p({ class: 'post-date' }, new Date(Number(art.date) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
        p(
          { class: 'post-author' },
          '/ by ',
          a({ href: `?author=${art.author}` }, art.author),
        ),
      ),
      div(
        { class: 'post-body clearfix' },
        h4(art['sub-title']),
        p(art['page-description']),
      ),
      a({ href: art.path, 'aria-label': 'Read More', class: 'readmore' }, 'Read More'),
    ),
  ));

  const postListing = div({ class: 'post-listing' }, ...articleElements);

  // Pagination logic
  const totalPages = Math.ceil(totalArticles / 10);
  const paginationDiv = div({ class: 'blog-pagination clearfix' });
  if (currentPage > 1) {
    const prevPageUrl = new URL(window.location.href);
    prevPageUrl.searchParams.set('page', parseInt(currentPage, 10) - 1);
    const prevButton = a(
      { href: `${prevPageUrl}`, class: 'button prev-posts' },
      'Previous',
    );
    paginationDiv.appendChild(prevButton);
  }
  if (currentPage < totalPages) {
    const nextPageUrl = new URL(window.location.href);
    nextPageUrl.searchParams.set('page', parseInt(currentPage, 10) + 1);
    const nextButton = a(
      { href: `${nextPageUrl}`, class: 'button next-posts' },
      'Next',
    );
    paginationDiv.appendChild(nextButton);
  }
  postListing.appendChild(paginationDiv);
  return postListing;
}

async function fetchNewsData() {
  try {
    const response = await fetch('/query-index.json');
    const jsonData = await response.json();
    return jsonData.data;
  } catch (error) {
    return [];
  }
}

async function getNewsContent(filteredResults, pageNumber = 1) {
  try {
    let sortedResults = [];
    if (filteredResults.length) {
      sortedResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
    }

    const itemsPerPage = 10;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const paginatedResults = sortedResults.slice(startIndex, startIndex + itemsPerPage);

    if (paginatedResults.length > 0) {
      return generateResultsBlock(paginatedResults, pageNumber, sortedResults.length);
    }
  } catch (error) {
    return '';
  }
  return '';
}

function setFullWidthToBody() {
  document.body.classList.add('full-width');
}

function createPageTopics() {
  const topics = getMetadata('article:tag');
  if (topics.trim()) {
    const tagList = document.createElement('p');
    tagList.className = 'post-topics';
    tagList.innerHTML = 'Topics: ';
    topics.split(',').forEach((topic, index) => {
      const anchor = document.createElement('a');
      anchor.className = 'topic-link';
      anchor.innerText = topic.trim();
      anchor.href = `/blog/?topic=${topic.trim()}`;
      tagList.appendChild(anchor);
      if (index < topics.split(',').length - 1) {
        tagList.appendChild(document.createTextNode(', '));
      }
    });
    return tagList;
  }
  return '';
}

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
  link.setAttribute('target', '_blank');
  const image = document.createElement('img');
  image.setAttribute('src', `/icons/${network}.svg`);
  const label = document.createElement('span');
  label.innerText = network === 'twitter' ? 'Tweet' : 'Share';
  link.appendChild(image);
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

function setSidebarMaxHeight() {
  let height = 0;
  const sidebar = document.querySelector('#sidebar');
  [...sidebar.children].forEach((element) => {
    height += element.offsetHeight;
  });
  sidebar.style.maxHeight = `${height + 50}px`;
}

function setSidebarHeight() {
  window.addEventListener('resize', setSidebarMaxHeight);
  window.addEventListener('click', setSidebarMaxHeight);
}

export default async function buildAutoBlocks(block) {
  const searchParams = new URLSearchParams(window.location.search);
  let pageNumber = 1; // Use let instead of const
  let finalArticles = [];
  if (searchParams.has('page')) { // Check for 'page' instead of 'sort'
    pageNumber = searchParams.get('page');
  }

  const data = await fetchNewsData();
  let filteredResults = data.filter((item) => {
    const path = item.path.toLowerCase();
    const regex = /^\/about-us\/news\/.*$/;
    return regex.test(path);
  });
  if (filteredResults.length) {
    filteredResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
  }

  const contentBlocks = block.querySelectorAll('.section');

  // Creating the default template wrapper
  const defaultTemplate = document.createElement('div');
  defaultTemplate.id = 'content-wrapper';

  // Creating content wrapper
  const content = document.createElement('div');
  content.id = 'content';

  // Creating outer element
  const outerElement = document.createElement('div');
  outerElement.className = 'outer';

  // Creating main and sidebar elements
  const main = document.createElement('div');
  main.id = 'main';

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';

  contentBlocks.forEach((blocks) => {
    // Appending Hero banner from each section
    const heroBanner = blocks.querySelector('.hero-wrapper');
    if (heroBanner) {
      defaultTemplate.appendChild(heroBanner); // Clone to avoid removing the original
    }

    // Handling sidebars within each section
    const sidebars = blocks.querySelectorAll('[data-block-name^="sidebar-"]');
    if (sidebars.length > 0) {
      sidebars.forEach((sidebarItem) => {
        sidebar.appendChild(sidebarItem); // Clone to keep the original in place
      });
    }

    main.appendChild(blocks);
    blocks.style.display = null;
  });

  if (searchParams.has('archive')) {
    const archive = searchParams.get('archive').toLowerCase();
    finalArticles = filteredResults.filter((art) => {
      const date = new Date(Number(art.date) * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toLowerCase();
      return date.replace(' ', '-') === archive;
    });
  } else if (searchParams.has('topic')) {
    const topic = searchParams.get('topic').replace('-', ' ');
    finalArticles = filteredResults.filter((art) => {
      const tags = JSON.parse(art.tags).map((tag) => tag.toLowerCase());
      return tags.includes(topic.toLowerCase());
    });
  } else if (searchParams.has('author')) {
    const author = searchParams.get('author');
    finalArticles = filteredResults.filter(
      (art) => art.author.toLowerCase() === author.toLowerCase(),
    );
  } else {
    finalArticles = filteredResults;
  }

  const newsRegex = /^\/about-us\/news(?:\/(?:\?.*)?)?$/;
  if (newsRegex.test(window.location.pathname)) {
    const newsContent = await getNewsContent(finalArticles, parseInt(pageNumber, 10));
    main.appendChild(newsContent);
  } else {
    const tagList = createPageTopics();
    if (tagList) {
      main.appendChild(tagList);
    }
    const shareTitle = getMetadata('og:title');
    const shareContainer = document.createElement('div');
    shareContainer.className = 'hs-blog-social-share';
    renderShareButtons(shareContainer, new URL(window.location.href), shareTitle);
    main.appendChild(shareContainer);
  }

  const topicSidebar = await generateTopicBlock(filteredResults);
  if (topicSidebar) {
    sideBarVisible = true;
    sidebar.prepend(topicSidebar);
  }

  const archiveSidebar = await generateArchiveBlock(filteredResults);
  if (archiveSidebar) {
    sideBarVisible = true;
    sidebar.prepend(archiveSidebar);
  }

  if (!sideBarVisible) {
    setFullWidthToBody();
  }

  // Creating clearfix element
  const clearFix = document.createElement('div');
  clearFix.className = 'clearfix';

  outerElement.appendChild(main);
  outerElement.appendChild(sidebar);
  if (!sidebar.children.length > 0) {
    document.body.classList.add('full-width');
  }
  content.appendChild(outerElement);
  content.appendChild(clearFix);
  defaultTemplate.appendChild(content);
  block.appendChild(defaultTemplate);
  const observer = new MutationObserver(() => {
    setSidebarMaxHeight();
  });
  observer.observe(sidebar, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  setSidebarMaxHeight();
  setSidebarHeight();
}
