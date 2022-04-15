import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  loadReviews() {
    const storage = localStorage.getItem('allReviews') || '{}';
    return JSON.parse(storage);
  }

  onInit() {
    // 1. получить координаты всех сущ. отзывов
    // localStorage.clear(); очистить
    const allReviews = this.loadReviews();
    // 2. отобразить существующие плейсмарки
    for (const item in allReviews) {
      allReviews[item].forEach((review) => {
        this.map.createPlacemark(JSON.parse(item));
      });
    }
    // 3. делегирование, чтобы отлавливать клики по кнопке Добавить
    document.body.addEventListener('click', this.onDocumentClick.bind(this));
  }

  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.innerHTML = `
    <div>
      <b>${item.name}</b> ${item.place}
    </div>
    <div><em>${item.text}</em></div>
    `;
      reviewList.appendChild(div);
    }

    return root;
  }

  onClick(coords) {
    const allReviews = this.loadReviews();
    const currentCoords = JSON.stringify(coords);
    const reviews = allReviews[currentCoords] || [];

    const form = this.createForm(coords, reviews);

    this.map.openBalloon(coords, form.innerHTML);
  }

  addReview(coords, review) {
    const allReviews = this.loadReviews();
    const currentCoords = JSON.stringify(coords);

    const reviews = allReviews[currentCoords] || [];

    reviews.push(review);

    allReviews[currentCoords] = reviews;
    localStorage.setItem('allReviews', JSON.stringify(allReviews));
  }

  onDocumentClick(e) {
    if (e.target.dataset.role === 'review-add') {
      const reviewForm = document.querySelector('[data-role=review-form]');
      const coords = JSON.parse(reviewForm.dataset.coords);
      const now = new Date();
      let month = now.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      const date = now.getDate() + '.' + month + '.' + now.getFullYear();
      const review = {
        name: document.querySelector('[data-role=review-name]').value.trim(),
        place:
          document.querySelector('[data-role=review-place]').value.trim() + ' ' + date,
        text: document.querySelector('[data-role=review-text]').value.trim(),
      };
      if (!review || !review.name || !review.place || !review.text) {
        const formError = document.querySelector('.form-error');
        formError.innerText = 'Не запоўнена!';
      } else {
        this.addReview(coords, review);
        this.map.createPlacemark(coords);
        this.map.closeBalloon();
      }
    }
  }
}
