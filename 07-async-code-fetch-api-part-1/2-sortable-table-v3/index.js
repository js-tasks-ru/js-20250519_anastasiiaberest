import fetchJson from './utils/fetch-json.js';
import SortableTableV0 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTablev extends SortableTableV0 {
  start = 0;
  end = 30;
  step = 30;
  loading = false;
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: 'title',
      order: 'asc'
    },
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;
    this.url = `${BACKEND_URL}/${url}`;
    this.isSortLocally = isSortLocally;
    this.createListeners();
    this.render();
  }

  sortOnClient(id, order) {
    this.sort(id, order);
  }

  async sortOnServer(id, order) {
    this.start = 0;
    this.end = this.step;

    const data = await this.fetchData(id, order, this.start, this.end);
    this.data = data;
    this.update(data);
    this.updateCell(id, order);
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handlerHeaderClick);
    window.addEventListener('scroll', this.onScroll);
  }

  removeListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handlerHeaderClick);
    window.removeEventListener('scroll', this.onScroll);
  }

  clearCellOrder() {
    const cells = this.element.querySelectorAll('.sortable-table__header .sortable-table__cell');
    for (const cell of cells) {
      cell.setAttribute('data-order', '');
    }
  }

  handlerHeaderClick = event => {
    const cellElement = event.target.closest('[data-sortable="true"]');

    if (!cellElement) {
      return;
    }

    const fieldName = cellElement.dataset.id;
    const fieldOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    this.clearCellOrder();
    if (this.isSortLocally) {
      this.sortOnClient(fieldName, fieldOrder)
    } else {
      this.sortOnServer(fieldName, fieldOrder)
    }
  };

  async fetchData(id, order, start = this.start, end = this.end) {
    this.subElements.loading.style.display = 'block';
    const url = new URL(this.url);

    url.searchParams.set('_sort', id);
    url.searchParams.set('_order', order);
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);

    this.loading = true;
    const response = await fetch(url.toString());
    const data = await response.json();
    this.loading = false;
    this.subElements.loading.style.display = 'none';

    return data;
  }

  onScroll = async () => {
    const bottomReached = window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

    if (bottomReached && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      const newData = await this.fetchData(this.sorted.id, this.sorted.order, this.start, this.end);
      if (newData.length === 0 && this.data.length === 0) {
        this.toggleEmptyPlaceholder([]);
      } else {
        this.data = [...this.data, ...newData];
        this.subElements.body.insertAdjacentHTML('beforeend', this.createTableBody(newData));
      }
    }
  };

  async render() {
    const data = await this.fetchData(this.sorted.id, this.sorted.order);
    super.data = data;
    this.update(data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
