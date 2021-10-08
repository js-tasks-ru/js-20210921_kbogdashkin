function compareString(a, b, sortIndex) {
  return sortIndex * a.localeCompare(b, ['ru', 'en'], {
    caseFirst: 'upper',
  });
}

function compareNumeric(first, second, sortIndex) {
  const a = parseInt(first, 10);
  const b = parseInt(second, 10);

  if (a > b) {
    return 1 * sortIndex;
  }
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return -1 * sortIndex;
  }
}

export function getSortableData({
  data = [],
  field = '',
  direction = 'asc',
  sortType = 'string',
}) {
  if (!field) {
    return data;
  }

  const sortDirections = {
    asc: 1,
    desc: -1,
  };

  const sortIndex = sortDirections[direction];

  return [...data].sort((a, b) => {
    return sortType === 'string'
      ? compareString(a[field], b[field], sortIndex)
      : compareNumeric(a[field], b[field], sortIndex);
  });
}

export default class SortableTable {
  element;
  sortField;
  sortDirection = 'asc';
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data.data ? data.data : data;

    this.render();
  }

  get template() {
    return `
    <div class="sortable-table">
        ${this.getHeader()}

        <div data-element="body" class="sortable-table__body">
            ${this.getBody(this.data)}
        </div>
    </div>`;
  }
  // <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getHeader() {
    // const sortArrow = `
    //     <span data-element="arrow" class="sortable-table__sort-arrow">
    //       <span class="sort-arrow"></span>
    //     </span>
    // `;

    const headings = this.headerConfig.map(tr => {
      const id = tr.id === this.sortField ? `data-id="${tr.id}"` : '';

      return `
        <div
            class="sortable-table__cell"
            ${id}
            data-sortable="${tr.sortable}"
            data-order="asc"
        >
            <span>${tr.title}</span>
        </div>
      `;
    });

    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
        ${headings.join('')}
    </div>
    `;
  }

  getBody(data = []) {
    if (!data.length) {
      return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>`;
    }

    let sortedData = data;

    if (this.sortField) {
      const sortType = this.headerConfig.find(item => item.id === this.sortField).sortType || '';

      sortedData = getSortableData({
        data,
        field: this.sortField,
        direction: this.sortDirection,
        sortType,
      });
    }

    return sortedData.map(item => {
      const arr = [];

      for (const field of this.headerConfig) {
        const content = field.template
          ? field.template(item[field.id])
          : `<div class="sortable-table__cell">${item[field.id]}</div>`;

        arr.push(content);
      }

      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${arr.join('\n')}
      </a>`;
    }).join('');
  }

  sort(field, sortDirection) {
    this.sortField = field;
    this.sortDirection = sortDirection;

    this.subElements.body.innerHTML = this.getBody(this.data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

