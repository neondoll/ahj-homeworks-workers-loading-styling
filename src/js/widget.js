import { API_ROOT } from './constants/envrionment';

export default class Widget {
  constructor() {
    this._body = undefined;
    this._container = undefined;
    this._element = undefined;

    this.updateItems = this.updateItems.bind(this);
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this._container = container;
  }

  checkBinding() {
    if (this._container === undefined) {
      throw new Error('Widget not bind to DOM');
    }
  }

  drawUI() {
    this.checkBinding();

    this._container.innerHTML = Widget.markup;
    this._element = this._container.querySelector(Widget.selector);
    this._body = this._element.querySelector(Widget.selectorBody);

    this.updateItems();

    this._element.querySelector(Widget.selectorBtnUpdate).addEventListener('click', this.updateItems);
  }

  async updateItems() {
    this._body.innerHTML = Array.from({ length: 3 }).map(() => Widget.markupItemLoading).join('');

    try {
      const response = await Widget.api;
      const data = await response.json();
      this._body.innerHTML = data.map(item => Widget.markupItem(item)).join('');
    }
    catch (error) {
      console.log(error);

      this._element.classList.add('widget--invalid');
    }
  }

  static get api() { return fetch(API_ROOT + '/api/cinema-world-news', { method: 'GET' }); }

  static get markup() {
    return `
      <section class="widget">
        <div class="widget__header">
          <h2 class="widget__title">Новости мира кино</h2>
          <button class="widget__btn-update" type="button">Обновить</button>
        </div>
        <div class="widget__body"></div>
      </section>
    `;
  }

  static markupItem(item) {
    return `
      <article class="widget__item widget-item" data-id="${item.id}">
        <h3 class="widget-item__title">${item.title}</h3>
        <div class="widget-item__description">
          <img class="widget-item__image" src="${item.image}" alt="${item.image}">
          <p class="widget-item__text">${item.text}</p>
        </div>
      </article>
    `;
  }

  static get markupItemLoading() {
    return `
      <div class="widget__item widget-item widget-item--loading">
        <span class="widget-item__title widget-item__title--loading"></span>
        <div class="widget-item__description widget-item__description--loading">
          <span class="widget-item__image widget-item__image--loading"></span>
          <span class="widget-item__text widget-item__text--loading"></span>
        </div>
      </div>
    `;
  }

  static get selector() { return '.widget'; }

  static get selectorBody() { return '.widget__body'; }

  static get selectorBtnUpdate() { return '.widget__btn-update'; }
}
