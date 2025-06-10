import fetchJson from './utils/fetch-json.js';
import ColumntChartv1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumntChartv1 {
  label;
  get subElements() {
    return {
      header: this.element.querySelector("[data-element='header']"),
      body: this.element.querySelector("[data-element='body']")
    };
  }

  constructor(options) {
    super(options);
    this.url = options?.url;
    this.label = options?.label;
    this.fetchData(options).
    then((dataObject) => this.update('', '', Object.values(dataObject)));
  }

  async fetchData (options) {
    const newURL = new URL(options.url, BACKEND_URL);
    newURL.searchParams.append('from', options.range?.from.toJSON());
    newURL.searchParams.append('to', options.range?.to.toJSON());
    const resp = await fetch(newURL.toString(), {method: 'GET'});
    return await resp.json();
  }

  async update(from, to, newdata) {
    if (newdata === undefined) {
      newdata = await this.fetchData({url: this.url, range: {from: from, to: to}});
      super.update(Object.values(newdata));
    }
    else {
      super.update(newdata);
    }
    return newdata;
  }

}
