export default class SortableTable {
  element;
  filter;
  subElements = {};


  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.template());
    this.selectSubElements();
    this.filter = this.createFilterElement();
  }



  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createFilterElement() {
    return this.createElement(this.createFilterTemplate());
  }

  createFilterTemplate() {
    return (
      `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
    );
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(columnConfig => (
      `<div class="sortable-table__cell" data-id="${columnConfig['id']}" data-sortable="${columnConfig.sortable}">
                <span>${columnConfig['title']}
                </span>

            </div>`
    )).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const fieldId = columnConfig['id'];
    if (fieldId === "images") {
      return columnConfig.template(product[fieldId]);
    }
    return `<div class="sortable-table__cell">${product[fieldId]}</div>`;
  }

  createTableBodyRowTemplate(product) {
    return `
            <a href="${product.id}" class="sortable-table__row">
                ${this.headerConfig.map(columnConfig => this.createTableBodyCellTemplate(product, columnConfig)).join('')}
            </a>
        `;
  }

  createTableBodyTemplate() {
    return this.data.map(product => (
      this.createTableBodyRowTemplate(product)
    )).join('')
  }

  template() {
    return `
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.createTableHeaderTemplate()}
                </div>
                <div data-element="body" class="sortable-table__body">
                    ${this.createTableBodyTemplate()}
                </div>
                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                    <div>
                        <p>No products satisfies your filter criteria</p>
                        <button type="button" class="button-primary-outline">Reset all filters</button>
                    </div>
                </div>
            </div>
        `;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }


  sort(field, order) {
    const config = this.headerConfig.find(item => item.id === field);

    if (!config || !config['sortable']) {
      return;
    }

    const k = order === 'asc' ? 1 : -1;

    if (config['sortType'] === "string") {
      this.data.sort((a, b) => k * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' }));
    }

    if (config['sortType'] === "number") {
      this.data.sort((a, b) => k * (a[field] - b[field]));
    }

    this.subElements.body.innerHTML = this.createTableBodyTemplate();
    this.updateHeaders(field, order);

  }

  updateHeaders(field, order) {
    const elementOrder = this.subElements.header.querySelector(`[data-id='${field}']`);
    elementOrder.appendChild(this.filter);
    elementOrder.dataset.order = order;
  }

  update(newData) {
    this.data = newData;
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
  }

  destroy() {
    this.element.remove();
  }

}


