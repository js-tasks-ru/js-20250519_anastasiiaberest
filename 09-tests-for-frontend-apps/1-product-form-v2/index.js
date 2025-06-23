import SortableList from '../../09-tests-for-frontend-apps/2-sortable-list/index.js';

import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';
import ProductForm0 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';


const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm extends ProductForm0 {
  constructor (productId = null) {
    super(productId);
    this.productId = productId;
  }

  async render () {
    await super.render();

    return this.element;
  }

  renderImageListContainerElement() {

    let items = super.getListImagesData();

    const sortableList = new SortableList({items});

    this.subElements.imageListContainer.append(sortableList.element);
  }
}
