export default function buildAutoBlocks(block) {
  const para = block.innerText;
  block.innerHTML = para;
  const forms = block.querySelectorAll('form');
  forms.forEach((form) => {
    const originalUrl = form.action;
    const continueUrl = window.location.href;
    // Replace the 'continue' parameter or add it if it doesn't exist
    form.action = originalUrl.replace(/(\?|&)continue=([^&]*)/, `$1continue=${continueUrl}`);
  });
  const accordions = block.querySelectorAll('.mmg-collapsible');
  if (accordions.length > 0) {
    accordions.forEach((accordion) => {
      accordion.children[0].addEventListener('click', () => {
        const content = accordion.querySelector('.content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
      });
    });
  }
}
