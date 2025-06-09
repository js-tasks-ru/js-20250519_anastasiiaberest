const DEFAULT_X = 5;
const DEFAULT_Y = 5;

class Tooltip {
  static #instance = null;
  element;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;
  }

  createElement() {
    const elem = document.createElement('div');
    elem.innerHTML = this.createTemplate();
    return elem;
  }

  createTemplate() {
    return `<div class="tooltip">This is tooltip</div>`;
  }

  handleDocumentPointerOver = (event) => {
    const target = event.target;
    let tooltipElement = null;

    if (target.closest && target.closest('[data-tooltip]')) {
      tooltipElement = target.closest('[data-tooltip]');
    }

    if (!tooltipElement) {
      return;
    }

    const textInnerHTML = tooltipElement.dataset.tooltip;
    this.render(textInnerHTML);
    this.updatePosition(event);
  };

  handleDocumentPointerOut = (event) => {
    const tooltipElement = event.target.closest('[data-tooltip]');
    if (!tooltipElement || !this.element.isConnected) {
      return;
    }
    this.remove();
  }

  handleDocumentPointerMove = (event) => {
    if (!this.element.isConnected) {
      return;
    }
    this.updatePosition(event);
  }

  createListeners() {
    document.addEventListener('pointerover', this.handleDocumentPointerOver);
    document.addEventListener('pointerout', this.handleDocumentPointerOut);
    document.addEventListener('pointermove', this.handleDocumentPointerMove);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.handleDocumentPointerOver);
    document.removeEventListener('pointerout', this.handleDocumentPointerOut);
    document.removeEventListener('pointermove', this.handleDocumentPointerMove);
  }

  updatePosition(event) {
    this.element.style.left = event.clientX + DEFAULT_X + 'px';
    this.element.style.top = event.clientY + DEFAULT_Y + 'px';
  }

  initialize () {
    this.element = this.createElement();
    this.createListeners();
  }

  render(innerHTML = '') {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = innerHTML;
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
