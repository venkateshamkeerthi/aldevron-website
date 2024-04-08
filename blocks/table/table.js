export default function decorate(block) {
  const getHeadingLeftClass = block.classList.contains('heading-left');
  if (getHeadingLeftClass) {
    const tds = block.querySelectorAll('tr td:first-child');
    let index = 0;
    while (index < tds.length) {
      const td = tds[index];
      td.classList.add('left-heading');
      const rowspan = td.getAttribute('rowspan');
      if (rowspan !== null && rowspan > 1) {
        const rowspanCount = parseInt(rowspan, 10);
        if (rowspanCount > 1) {
          for (let i = 1; i < rowspanCount; i += 1) {
            const parent = td.parentElement;
            parent.classList.add('bg-white');
          }
        }
        index += rowspanCount;
      } else {
        index += 1;
      }
    }
  }

  const tableRows = block.querySelectorAll('.table[data-block-name="table"] tr');
  tableRows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      if (cell.innerText.trim() === '') {
        cell.classList.add('bg-transparent');
      }
      if (cell.innerText.trim() === '' && index === 0) {
        cell.classList.add('no-border');
      }
    });
  });
}
