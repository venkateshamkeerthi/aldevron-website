import {
  buildBlock,
  capitalizeWords,
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  getMetadata,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  sampleRUM,
  toClassName,
  waitForLCP,
} from './aem.js';

const LCP_BLOCKS = ['hero-carousel', 'forms']; // add your LCP blocks to the list

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/Typo.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

const TEMPLATE_LIST = [
  'default',
  'blog',
  'news',
  'anniversary',
  'landing-page',
];

const CATEGORY_LIST = [
  'plasmids',
  'proteins',
  'mrna',
];

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    if (TEMPLATE_LIST.includes(template)) {
      const templateName = capitalizeWords(template);
      const mod = await import(`../templates/${templateName}/${templateName}.js`);
      loadCSS(`${window.hlx.codeBasePath}/templates/${templateName}/${templateName}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateCategory(main) {
  try {
    const category = toClassName(getMetadata('category'));
    if (CATEGORY_LIST.includes(category)) {
      const categoryName = capitalizeWords(category);
      const mod = await import(`../category/${categoryName}/${categoryName}.js`);
      loadCSS(`${window.hlx.codeBasePath}/category/${categoryName}/${categoryName}.css`);
      if (mod.default) {
        await mod.default(main);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function findParentListItem(content, url) {
  const matchingChild = Array.from(content.children).find((child) => !!child.querySelector(`a[href="${url}"]`));
  if (matchingChild) {
    const element = matchingChild.querySelector(`a[href="${url}"]`);
    const elementParent = element.closest('li');
    if (elementParent) {
      elementParent.classList.add('active');
      Array.from(elementParent.parentNode.children).forEach((sibling) => {
        sibling.style.display = 'block';
      });
    }
    return matchingChild.querySelector('ul') || null;
  }
  return null;
}

async function getSubNavigation(pathname) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();
    const headerElement = document.createElement('div');
    headerElement.innerHTML = html;
    const lastUlElement = headerElement.querySelector('div > div > ul:last-child');
    return findParentListItem(lastUlElement, pathname);
  }
  return '';
}

async function decorateNavigation(main) {
  if (getMetadata('navigation')) {
    const sidebarElement = main.querySelector('#sidebar');
    const navigation = await getSubNavigation(window.location.pathname);
    if (navigation) {
      const links = navigation.querySelectorAll('a');
      links.forEach((link) => {
        if (link.parentElement.tagName === 'STRONG') {
          link.setAttribute('target', '_blank');
        }
      });
      const block = await buildBlock('sidebar-navigation', navigation);
      sidebarElement.prepend(block);
      if (document.body.classList.contains('full-width')) {
        document.body.classList.remove('full-width');
      }
    }
  }
}

/**
 * Builds embed block for inline links to known social platforms.
 * @param {Element} main The container element
 */
function buildEmbedBlocks(main) {
  const HOSTNAMES = [
    'youtube',
    'youtu',
  ];
  [...main.querySelectorAll(':is(p, div) > a[href]:only-child')]
    .filter((a) => HOSTNAMES.includes(new URL(a.href).hostname.split('.').slice(-2, -1).pop()))
    .forEach((a) => {
      const parent = a.parentElement;
      const block = buildBlock('embed', { elems: [a] });
      parent.replaceWith(block);
      decorateBlock(block);
    });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildEmbedBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await decorateTemplates(main);
    await decorateCategory(main);
    await decorateNavigation(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));

  await loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  await loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

/*
To Continue Smoother flow of UTMs across the pages user visits in same session.
*/

// check if UTM parameters exist in the URL
function checkUTMParametersExist() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');

  // Check if any of the UTM parameters exist
  if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
    return true; // UTM parameters exist
  }
  return false; // UTM parameters do not exist
}

// Get UTM parameters from the URL
function getUTMParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  // Define UTM parameter names
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');

  // Create an object to store UTM parameters
  const utmData = {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
  };

  return utmData;
}

// To store UTM parameters in local storage
function storeUTMParameters() {
  const utmData = getUTMParameters();

  // Check if UTM parameters exist
  if (Object.values(utmData).some((param) => param !== null && param !== undefined)) {
    // Convert the object to a JSON string and store it in local storage
    sessionStorage.setItem('utm_data', JSON.stringify(utmData));
  }
}

function checkUTMParametersInLocalStorage() {
  const utmDataString = sessionStorage.getItem('utm_data');
  return utmDataString !== null && utmDataString !== undefined;
}

// Retrive UTM parameters from storage.
function getUTMDataFromLocalStorage() {
  const utmDataString = sessionStorage.getItem('utm_data');
  if (utmDataString) {
    return JSON.parse(utmDataString);
  }
  return null;
}

// To add UTM parameters to the browser's URL
function addUTMParametersToURL() {
  const utmData = getUTMDataFromLocalStorage();
  if (utmData) {
    const urlParams = new URLSearchParams(window.location.search);
    Object.keys(utmData).forEach((key) => {
      if (!urlParams.has(key) && utmData[key]) {
        urlParams.append(key, utmData[key]);
      }
    });
    const newURL = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, document.title, newURL);
  }
}

function correctUTMFlow() {
  if (checkUTMParametersExist()) {
    /* console.log('UTM parameters exist in the URL.');
    Call the function to store UTM parameters when the page loads */
    storeUTMParameters();
  } else if (checkUTMParametersInLocalStorage()) {
    // console.log('UTM parameters do not exist in the URL but present in Local storage');
    addUTMParametersToURL();
  } else {
    // console.log('No UTMs Found!');
  }
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
  correctUTMFlow();
}

loadPage();
