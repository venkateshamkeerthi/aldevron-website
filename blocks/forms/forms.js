import { passFormConfig, extractTableData } from '../../scripts/aem.js';

let formConfig = {};

export default async function decorate(block) {
  const table = block.querySelector('table');
  formConfig = await extractTableData(table);
  const form = document.createElement('div');
  form.id = formConfig.target;
  form.classList.add('content');
  if (table) {
    table.replaceWith(form);
  }
  passFormConfig(formConfig);
}
