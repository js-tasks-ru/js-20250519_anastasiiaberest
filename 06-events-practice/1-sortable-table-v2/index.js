import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTable {

  arrowElement;
  isSortLocally;

  constructor(headerConfig, { data = [], sorted = {} } = {}, isSortLocally = true) {
    super(headerConfig, data);
    this.createListeners();
    this.arrowElement = this.createArrowElement();

    this.id = sorted.id;
    this.order = sorted.order;
    this.isSortLocally = isSortLocally;

    this.updateHeaders(this.id, this.order);
    this.sort(this.id, this.order);

  }

  createArrowElement() {
    return this.createElement(this.createArrowTemplate());
  }

  createArrowTemplate() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
  }


  updateHeaders(field, order) {
    const headerCell = this.subElements.header.querySelector(`[data-id="${field}"]`);
    if (!headerCell) return;

    headerCell.dataset.order = order;
    headerCell.append(this.arrowElement);
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    if (cellElement.dataset.sortable !== "true") {
      return;
    }

    const sortField = cellElement.dataset.id;
    const sortOrder = cellElement.dataset.order; // @TODO:

    let order = 'desc';
    if (sortOrder === 'asc') {
      order = 'desc';
    } else if (sortOrder === 'desc') {
      order = 'asc';
    }

    this.sort(sortField, order);
    this.updateHeaders(sortField, order);

    //cellElement.append(this.arrowElement);
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sortOnServer(sortField, sortOrder) {
    //TODO
  }

  sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer(sortField, sortOrder);
    }
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }

}


