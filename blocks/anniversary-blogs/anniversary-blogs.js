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
  
  
  function createAnniversaryBlogCard(post) {
    const card = div({ class: 'blog-card' });
    const image = img({ src: post.image, alt: post.title });
    const title = h3({ class: 'blog-title' }, a({ href: post.path }, post.title));
    const description = p({ class: 'blog-description' }, truncateText(post.description, 180));
    const readMore = a({ href: post.path, class: 'read-more' }, 'Read more');
  
    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(readMore);
  
    return card;
  }
  
  function createAnniversaryBlogs(results) {
    const container = div({ class: 'blog-cards-container' });
    results.forEach((post) => {
      const card = createAnniversaryBlogCard(post);
      container.appendChild(card);
    });
    return container;
  }
  
  export default async function decorate(block) {
    const blockData = readBlockConfig(block);
    const postData = await fetchPostData();
    let topic = '';
    if (blockData.topic) {
      topic = blockData.topic;
    }
    const wrapper = div({ class: 'content flex' });
    const blogTitles = block.children[0].cloneNode(true);
    if (block.children[1]) {
      topic = block.children[1].children[1].innerText.trim();
    }
    if (blogTitles.children[0]) {
      const title = blogTitles.children[0];
      const blogsContainer = div({ class: 'col recent-blogs' });
      let sortedResults = [];
      const filteredResults = postData.filter((item) => item.path.includes('/25th-anniversary/') && (topic ? JSON.parse(item.tags).filter((tag) => tag.toLowerCase().trim() === topic.toLowerCase().trim()).length > 0 : true));
      if (filteredResults.length) {
        sortedResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
      }
      const blogCardsContainer = createAnniversaryBlogs(sortedResults); // Create container with blog cards
      blogsContainer.appendChild(title);
      blogsContainer.appendChild(blogCardsContainer); // Append the blog cards container to the blogsContainer
      wrapper.appendChild(blogsContainer);
    }
  
    block.innerText = '';
    block.appendChild(wrapper);
  
    // Append wrapper to the block's parent element
    block.parentNode.appendChild(wrapper);
  }
  