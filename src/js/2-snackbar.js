import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = Number(form.elements.delay.value);
  const state = form.elements.state.value;

  form.reset();

  createPromise(delay, state)
    .then(delay => {
      iziToast.success({
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topCenter',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/14090/14090371.png',
        timeout: 3000,
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `Rejected promise in ${delay}ms`,
        position: 'topCenter',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/9068/9068699.png',
        timeout: 3000,
      });
    });
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}
