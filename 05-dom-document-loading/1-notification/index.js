export default class NotificationMessage {
  static lastShownComponent = null;

  constructor(message = '', { duration, type } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement();
  }

  show(target = document.body) {
    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.destroy();
    }
    NotificationMessage.lastShownComponent = this;
    this.timerId = setTimeout(() => this.remove(), this.duration);
    target.appendChild(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timerId);
    this.remove();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return `
         <div class="notification ${this.type}" style='--value:${this.duration}ms'>
         <div class="timer"></div>
          <div class="inner-wrapper">
              <div class="notification-header">
                ${this.type}
              </div>
              <div class="notification-body">
                  ${this.message}
          </div>
          </div>`;
  }

}
