class Tooltip {
  static instance;
  element;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  initialize() {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');

    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  render(text = '') {
    this.element.innerHTML = text;
    document.body.append(this.element);
  }

  onPointerOver = (event) => {
    const source = event.target.closest('[data-tooltip]');

    if (source && source.dataset?.tooltip) {
      this.render(source.dataset.tooltip);

      source.addEventListener('pointermove', this.onPointerMover);
    }
  }

  onPointerOut = (event) => {
    const source = event.target.closest('[data-tooltip]');

    if (source) {
      source.removeEventListener('pointermove', this.onPointerMover);
      this.element.remove();
    }
  }

  onPointerMover = (event) => {
    const left = parseInt(event.clientX, 10) + 5;
    const top = event.clientY;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  remove() {
    if (this.element) {
      this.element.removeEventListener('pointerover', this.onPointerOver);
      this.element.removeEventListener('pointerout', this.onPointerOut);
      this.element.removeEventListener('pointermove', this.onPointerMover);
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.source = null;
  }
}

export default Tooltip;
