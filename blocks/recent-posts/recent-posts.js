import {
  div, a, img, p, h3,
} from '../../scripts/dom-builder.js';

import { readBlockConfig } from '../../scripts/aem.js';

async function fetchPostData() {
  try {
    const response = await fetch('/query-index.json');
    const jsonData = await response.json();
    return jsonData.data;
  } catch (error) {
    return [];
  }
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

function createRecentPosts(results) {
  const lists = div({ class: 'posts' });
  results.forEach((post) => {
    const showcaseBanner = div({ class: 'post' });
    const articleCardImage = a({ class: 'image', href: post.path }, img({
      src: post.image, alt: post.title, width: '100%', height: 'auto',
    }));
    const articleCardBody = div({ class: 'text' });
    const articleHeading = h3({ class: 'entry-title' }, a({ href: post.path }, post.title));
    const articleDescription = p({ class: 'intro' }, truncateText(post.description, 180));
    articleCardBody.appendChild(articleHeading);
    articleCardBody.appendChild(articleDescription);
    if (post.image) {
      showcaseBanner.appendChild(articleCardImage);
    } else {
      showcaseBanner.classList.add('full-post');
    }
    showcaseBanner.appendChild(articleCardBody);
    lists.append(showcaseBanner);
  });
  return lists;
}

export default async function decorate(block) {
  const blockData = readBlockConfig(block);
  const postData = await fetchPostData();
  let topic = '';
  if (blockData.topic) {
    topic = blockData.topic;
  }
  const wrapper = div({ class: 'content flex cols2' });
  const blogTitles = block.children[0].cloneNode(true);
  if (block.children[1]) {
    topic = block.children[1].children[1].innerText.trim();
  }
  if (blogTitles.children[0]) {
    const title = blogTitles.children[0];
    const blogsContainer = div({ class: 'col recent-posts' });
    let sortedResults = [];
    const filteredResults = postData.filter((item) => item.path.includes('/news/') && (topic ? JSON.parse(item.tags).filter((tag) => tag.toLowerCase().trim() === topic.toLowerCase().trim()).length > 0 : true));
    if (filteredResults.length) {
      sortedResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
    }
    const postElement = createRecentPosts(sortedResults.slice(0, 3));
    blogsContainer.appendChild(title);
    blogsContainer.appendChild(postElement);
    wrapper.appendChild(blogsContainer);
  }
  const newsTitles = block.children[0].cloneNode(true);
  if (newsTitles.children[1]) {
    const title = newsTitles.children[1];
    const blogsContainer = div({ class: 'col recent-posts' });
    let sortedResults = [];
    const filteredResults = postData.filter((item) => item.path.includes('/blog/') && (topic ? JSON.parse(item.tags).filter((tag) => tag.toLowerCase().trim() === topic.toLowerCase().trim()).length > 0 : true));
    if (filteredResults.length) {
      sortedResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
    }
    const postElement = createRecentPosts(sortedResults.slice(0, 3));
    blogsContainer.appendChild(title);
    blogsContainer.appendChild(postElement);
    wrapper.appendChild(blogsContainer);
  }
  block.innerText = '';
  block.appendChild(wrapper);
}
