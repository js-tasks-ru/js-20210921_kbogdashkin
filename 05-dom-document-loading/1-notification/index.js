export default class NotificationMessage {
  timeOut;
  element;

  constructor(message = '', {duration = 1000, type = 'success'} = {}) {
    if (NotificationMessage._instance) {
      NotificationMessage._instance.destroy();
    }
    NotificationMessage._instance = this;

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">${this.message}</div>
        </div>
    </div>`;
  }

  show(el = null) {
    if (el) {
      el.append(this.element);
    } else {
      document.body.append(this.element);
    }

    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.timeOut = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  remove() {
    if (this.element) {
      this.element.remove();

      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage._instance = null;
  }
}
