import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    // ...
  }

  createForm(coords) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    return root;
  }

  onClick(coords) {
    const form = this.createForm(coords);
    this.map.openBalloon(coords, form.innerHTML);
  }
}
