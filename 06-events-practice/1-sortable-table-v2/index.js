export function getSortableData({
  data = [],
  field = '',
  direction = 'desc',
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
    const fieldA = a[field];
    const fieldB = b[field];

    switch (sortType) {
    case 'string':
      return sortIndex * fieldA.localeCompare(fieldB, ['ru', 'en'], {
        caseFirst: 'upper',
      });
    case 'number':
      return sortIndex * (parseInt(fieldA, 10) - parseInt(fieldB, 10));
    }
  });
}

export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], {
    data = [],
    sorted = {
      id: '',
      order: 'desc',
    }
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data.data ? data.data : data;
    this.sorted = sorted;

    this.render();
  }

  get template() {
    return `
    <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeader()}
        </div>

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

    this.element.addEventListener('pointerdown', this.onHeaderClick);
  }

  onHeaderClick = (event) => {
    const arrow = document.querySelector('.sortable-table__sort-arrow');
    const td = event.target.closest('.sortable-table__cell');
    const { id, sortable, order } = td.dataset;

    if (sortable) {
      let newOrder = 'desc';

      if (id === this.sorted.id) {
        newOrder = order === 'asc' ? 'desc' : 'asc';
      }

      td.setAttribute('data-order', newOrder);
      td.appendChild(arrow);

      this.sort(id, newOrder);
    }
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
    const sortArrow = `
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
    `;

    const headings = this.headerConfig.map(tr => {
      const isSelected = tr.id === this.sorted.id;

      return `
        <div
            class="sortable-table__cell"
            data-id="${tr.id}"
            data-sortable="${tr.sortable}"
            data-order="asc"
        >
            <span>${tr.title}</span>
            ${isSelected ? sortArrow : ''}
        </div>
      `;
    });

    return headings.join('');
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

    if (this.sorted?.id) {
      const sortType = this.headerConfig.find(item => item.id === this.sorted.id).sortType || '';

      sortedData = getSortableData({
        data,
        field: this.sorted.id,
        direction: this.sorted.order,
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

  sort(id, order) {
    this.sorted.id = id;
    this.sorted.order = order;

    this.subElements.body.innerHTML = this.getBody(this.data);
  }

  remove() {
    if (this.element) {
      this.element.removeEventListener('pointerdown', this.onHeaderClick);
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

