export default function decorate() {
  const contactUsClass = document.getElementsByClassName('contactus block');
  contactUsClass[0].setAttribute('id', 'section-support');
  contactUsClass[0].children[0].setAttribute('class', 'outer');
  contactUsClass[0].children[0].children[0].setAttribute('class', 'text');
  const contactUsDiv = contactUsClass[0].children[0].children[0];
  const pTags = contactUsDiv.getElementsByTagName('p');
  const aTags = contactUsDiv.querySelector('a');
  if (aTags.hasAttribute('title')) {
    aTags.removeAttribute('title');
  }
  let innerElements = '';
  let phone = '';
  for (let i = 0; i < pTags.length; i += 1) {
    if (i === 0) {
      const contactUsTitle = pTags[i].outerHTML.replace(/<p>/g, '<h2>');
      innerElements += contactUsTitle.replace(/<\/p>/g, '</h2>');
    } else if (i === 1) {
      innerElements += pTags[i].outerHTML;
    } else if (i === 2) {
      phone = pTags[i].innerText;
      const anchor = document.createElement('a');
      anchor.classList.add('phone');
      anchor.setAttribute('href', `tel:${phone}`);
      anchor.innerText = phone;
      innerElements += anchor.outerHTML; // Use anchor.outerHTML here
    } else {
      innerElements += pTags[i].outerHTML;
    }
  }
  contactUsDiv.innerHTML = innerElements;
}
