export default function decorate(block) {
  const allAnchorTags = document.querySelectorAll('a');
  allAnchorTags.forEach((anchorTag) => {
    anchorTag.removeAttribute('title');
  });
  const divCta = document.querySelector('div .cta');
  block.classList.add('faq-accordion');
  if (divCta) {
    const expandCollapse = document.createElement('div');
    expandCollapse.classList.add('expand_collapse');
    const expandBtn = document.createElement('a');
    expandBtn.classList.add('expand-btn');
    expandBtn.textContent = 'Expand All';
    const collapseBtn = document.createElement('a');
    collapseBtn.classList.add('collapse-btn');
    collapseBtn.textContent = 'Collapse All';
    expandCollapse.appendChild(expandBtn);
    expandCollapse.appendChild(collapseBtn);
    const parent = block.parentNode;
    parent.prepend(expandCollapse);
    // event listeners for expand, collapse buttons
    expandCollapse.addEventListener('click', (event) => {
      if (event.target.classList.contains('expand-btn')) {
        document.querySelector('.expand_collapse').classList.add('expanded');
        document.querySelector('.collapse-btn').style.display = 'inline-block';
        const allQuestions = document.querySelectorAll('.faq-question');
        allQuestions.forEach((ele) => {
          ele.classList.add('active');
          ele.nextElementSibling.classList.add('active');
          ele.nextElementSibling.style.maxHeight = `${ele.nextElementSibling.scrollHeight}px`;
        });
      } else if (event.target.classList.contains('collapse-btn')) {
        document.querySelector('.expand_collapse').classList.remove('expanded');
        document.querySelector('.collapse-btn').style.display = 'none';
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach((ele) => {
          ele.nextElementSibling.style.maxHeight = '0';
        });
        setTimeout(() => {
          const allQuestions = document.querySelectorAll('.faq-question');
          allQuestions.forEach((ele) => {
            ele.classList.remove('active');
            ele.nextElementSibling.classList.remove('active');
            ele.nextElementSibling.style.removeProperty('max-height');
          });
        }, 300);
      }
    });
  }
  const faqRows = [...block.children];
  faqRows.forEach((ele) => {
    if (ele.children[0].innerHTML === '') {
      ele.remove();
    }
  });
  faqRows.forEach((row, index) => {
    const faqQuestion = [...row.children][0];
    faqQuestion.classList.add('faq-question');
    faqQuestion.id = `faq-question-${index}`;
    faqQuestion.addEventListener('click', (e) => {
      const currentFaq = e.currentTarget.classList.contains('active');
      const openfaq = block.querySelector('.faq-question.active');
      if (openfaq && !currentFaq) {
        openfaq.classList.toggle('active');
        openfaq.nextElementSibling.style.maxHeight = 0;
        setTimeout(() => {
          openfaq.nextElementSibling.classList.toggle('active');
          faqQuestion.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      setTimeout(() => {
        const faqAnswer = e.target.nextElementSibling;
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) {
          faqAnswer.classList.toggle('active');
          faqAnswer.style.maxHeight = `${faqAnswer.scrollHeight}px`;
        } else {
          faqAnswer.style.maxHeight = 0;
          setTimeout(() => {
            faqAnswer.classList.toggle('active');
          }, 300);
        }
      }, 300, e);
    });
    const faqAnswer = [...row.children][1];
    faqAnswer.classList.add('faq-answer');
  });
}
