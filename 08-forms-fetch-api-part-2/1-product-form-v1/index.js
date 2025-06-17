import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  CATEGORIES_URL = '/api/rest/categories';
  PRODUCT_URL = '/api/rest/products'
  categories;
  productData;

  constructor (productId) {
    this.productId = productId;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  createFormTemplate () {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">

              </ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" id="subcategory" name="subcategory">
              ${this.createOptions()}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  createForm () {
    const element = document.createElement('div');
    element.innerHTML = this.createFormTemplate();
    return element.firstElementChild
  }

  createOptions() {
    const cat = this.categories;
    let options = [];
    for (let option of cat) {
      for (let subOption of option.subcategories) {
        options.push(`
          <option value="${escapeHtml(subOption.id)}">
            ${escapeHtml(option.title)} &gt; ${escapeHtml(subOption.title)}
          </option>
        `);
      }
    }
    return options.join('');
  }

  createImages(data) {
    const fragments = document.createDocumentFragment();

    for (const img of data) {
      const li = document.createElement('li');
      li.className = 'products-edit__imagelist-item sortable-list__item';
      li.innerHTML = `
        <input type="hidden" name="url" value="${escapeHtml(img.url)}">
        <input type="hidden" name="source" value="${escapeHtml(img.source)}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(img.url)}">
          <span>${escapeHtml(img.source)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      `;
      fragments.appendChild(li);
    }

    return fragments;
  }

  populateProductData() {
    const data = this.productData[0];
    const form = this.element.querySelector('form');

    const title = form.querySelector('[name="title"]');
    const description = form.querySelector('[name="description"]');
    const price = form.querySelector('[name="price"]');
    const discount = form.querySelector('[name="discount"]');
    const quantity = form.querySelector('[name="quantity"]');
    const status = form.querySelector('[name="status"]');
    const subcategory = form.querySelector('[name="subcategory"]');

    const imageList = form.querySelector('.sortable-list');
    imageList.append(this.createImages(data.images));


    title.value = data.title;
    description.value = data.description;
    price.value = data.price;
    discount.value = data.discount;
    quantity.value = data.quantity;
    status.value = data.status;
    subcategory.value = data.subcategory;
  }

  async fetchCategories () {
    const url = new URL(`${BACKEND_URL}${this.CATEGORIES_URL}`);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    const res = await fetch(url.toString());
    if(res.ok) return await res.json();
  }

  async fetchProduct() {
    const url = new URL(`${BACKEND_URL}${this.PRODUCT_URL}`);
    url.searchParams.set('id', this.productId);
    const res = await fetch(url.toString());
    if(res.ok) return await res.json();
  }

  async render () {
    this.categories = await this.fetchCategories();
    if(!this.categories) return;
    this.element = this.createForm();
    this.subElements = this.getSubElements(this.element);
    this.createListeners();
    if(this.productId) {
      this.productData = await this.fetchProduct();
      this.populateProductData();
    }
    return this.element;
  }

  createListeners() {
    this.onSaveClick = this.collectFormData.bind(this);
    this.onUploadClick = this.handleImageUpload.bind(this);

    const saveButton = this.element.querySelector("[name='save']");
    const uploadImageButton = this.element.querySelector("[name='uploadImage']");

    saveButton.addEventListener('click', this.onSaveClick);
    uploadImageButton.addEventListener('click', this.onUploadClick);
  }

  removeListeners() {
    const saveButton = this.element.querySelector("[name='save']");
    const uploadImageButton = this.element.querySelector("[name='uploadImage']");

    if (saveButton && this.onSaveClick) {
      saveButton.removeEventListener('click', this.onSaveClick);
    }

    if (uploadImageButton && this.onUploadClick) {
      uploadImageButton.removeEventListener('click', this.onUploadClick);
    }
  }

  async handleImageUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', async () => {
      const [file] = fileInput.files;
      if (!file) return;

      try {
        const imageUrl = await this.uploadImage(file);
        this.addImageToList({ url: imageUrl, source: file.name });
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
      }
    });

    fileInput.click();
  }

  collectFormData(e) {
    e.preventDefault();

    const form = this.element.querySelector("[data-element='productForm']");

    const data = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      subcategory: form.subcategory.value,
      price: parseInt(form.price.value),
      discount: parseInt(form.discount.value),
      quantity: parseInt(form.quantity.value),
      status: parseInt(form.status.value),
      images: []
    };

    if (this.productId) {
      data.id = this.productId;
    }

    const imageList = form.querySelectorAll('.sortable-list li');
    for (const li of imageList) {
      const url = li.querySelector('input[name="url"]').value;
      const source = li.querySelector('input[name="source"]').value;
      data.images.push({ url, source });
    }

    this.save(data);
  }

  async save(data) {
    try {
      const url = new URL(`${BACKEND_URL}${this.PRODUCT_URL}`);
      const method = this.productId ? 'PATCH' : 'PUT';

      const response = await fetchJson(url, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      });

      const eventName = this.productId ? 'product-updated' : 'product-saved';
      this.element.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: response
      }));

    } catch (err) {
      console.error('Ошибка при сохранении товара:', err);
    }
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData
    });

    const result = await response.json();
    return result.data.link;
  }

  addImageToList({ url, source }) {
    const listContainer = this.element.querySelector('.sortable-list');

    const li = document.createElement('li');
    li.className = 'products-edit__imagelist-item sortable-list__item';
    li.innerHTML = `
      <input type="hidden" name="url" value="${escapeHtml(url)}">
      <input type="hidden" name="source" value="${escapeHtml(source)}">
      <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(url)}">
        <span>${escapeHtml(source)}</span>
      </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button>
    `;

    listContainer.appendChild(li);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}
