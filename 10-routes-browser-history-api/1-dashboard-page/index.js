import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  constructor() {
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.selectSubElements();
    this.range = {
      from: new Date(Date.now() - 2592e6),
      to: new Date(),
    };
    this.rangePicker = null;
    this.columnChartOrders = this.columnChartOrdersCreate();
    this.columnChartSales = this.columnChartSalesCreate();
    this.columnChartCustomers = this.columnChartCustomersCreate();
    this.dateSelect = false;
    this.createListeners();
  }
  createElement(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  createTemplate() {
    return `<div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }
  selectSubElements() {
    this.element.querySelectorAll("[data-element]").forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }
  async render() {
    this.subElements.rangePicker.innerHTML = "";
    this.subElements.sortableTable.innerHTML = "";

    this.rangePicker = new RangePicker({ from: this.range.from, to: this.range.to });
    this.subElements.rangePicker.append(this.rangePicker.element);

    if (!this.dateSelect) {
      this.subElements.ordersChart.append(this.columnChartOrders.element);
      this.subElements.salesChart.append(this.columnChartSales.element);
      this.subElements.customersChart.append(this.columnChartCustomers.element);
      this.subElements.sortableTable.append(this.sortableTableCreate("api/dashboard/bestsellers").element);
    } else {
      this.columnChartOrders.update(this.range.from, this.range.to);
      this.columnChartSales.update(this.range.from, this.range.to);
      this.columnChartCustomers.update(this.range.from, this.range.to);

      const url = await this.updateUrl();
      this.subElements.sortableTable.append(this.sortableTableCreate(url).element);
    }

    return this.element;
  }
  resetFilters = (e) => {
    const buttonPlaceholder = e.target.closest(".sortable-table__empty-placeholder");
    if (!buttonPlaceholder) {
      return;
    }
    this.range = {
      from: new Date(Date.now() - 2592e6),
      to: new Date(),
    };

    this.dateSelect = false;
    this.render();
  }
  async updateUrl() {
    const url = new URL("api/dashboard/bestsellers", BACKEND_URL);
    url.searchParams.append("from", this.range.from.toISOString());
    url.searchParams.append("to", this.range.to.toISOString());

    return url;
  }
  columnChartOrdersCreate() {
    return new ColumnChart({
      url: "api/dashboard/orders",
      range: this.range,
      link: "#",
      label: "orders",
      formatHeading: (data) => data.toLocaleString(),
    });
  }
  columnChartSalesCreate() {
    return new ColumnChart({
      url: "api/dashboard/sales",
      range: this.range,
      label: "sales",
      formatHeading: (data) => data.toLocaleString(),
    });
  }
  columnChartCustomersCreate() {
    return new ColumnChart({
      url: "api/dashboard/customers",
      range: this.range,
      label: "customers",
      formatHeading: (data) => data.toLocaleString(),
    });
  }
  sortableTableCreate(url) {
    return new SortableTable(header, {
      url: url,
      isSortLocally: true,
    });
  }
  createListeners() {
    this.element.addEventListener("date-select", this.onRangePickerDateSelect);
    this.element.addEventListener("click", this.resetFilters);
  }
  destroyListeners() {
    this.element.removeEventListener(
      "date-select",
      this.onRangePickerDateSelect
    );
    this.element.removeEventListener("click", this.resetFilters);
  }
  onRangePickerDateSelect = (e) => {
    this.range = e.detail;
    this.dateSelect = true;
    this.render();
  };
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }

}
