import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data,
  } = {}) {
    this.data = [];
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);

    this.render();
    this.update(this.range.from, this.range.to);
  }

  get template() {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
            ${this.label}
            ${this.getLink()}
        </div>

        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
                ${this.value}
            </div>

            <div data-element="body" class="column-chart__chart">
                ${this.getColumnBody(this.data)}
            </div>
        </div>
    </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  fetchData(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    return fetchJson(this.url);
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

  getLink() {
    return this.link
      ? `<a class="column-chart__link" href="${this.link}">View all</a>`
      : '';
  }

  getColumnBody(fetchedData) {
    const data = Object.values(fetchedData);

    if (!data.length) {
      return '';
    }

    const maxValue = data.reduce((sum, cur) => sum > cur ? sum : cur, 0);
    const scale = maxValue / this.chartHeight;

    const values = data.map(item => {
      const val = Math.floor(item / scale);
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${val}" data-tooltip="${percent}%"></div>`;
    });

    return values.join('');
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const data = await this.fetchData(from, to);

    if (data) {
      this.subElements.body.innerHTML = this.getColumnBody(data);

      this.element.classList.remove('column-chart_loading');

      return data;
    }
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
