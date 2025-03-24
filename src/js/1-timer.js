import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const dateInput = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let selectedDate = null;
let timerId = null;
let isTimerRunning = false;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    const now = new Date();

    setTimeout(() => {
      if (picked <= now) {
        iziToast.error({
          message: 'Please choose a date in the future',
          position: 'topCenter',
          backgroundColor: '#f44336',
          messageColor: '#fff',
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/545/545676.png',
          iconColor: '#fff',
          timeout: 4000,
          close: true,
          progressBar: false,
          layout: 2,
          displayMode: 2,
          class: 'custom-izi-toast',
        });
        startBtn.disabled = true;
      } else {
        selectedDate = picked;
        if (!isTimerRunning) {
          startBtn.disabled = false;
        }
      }
    }, 0);
  },
};

flatpickr(dateInput, options);

startBtn.addEventListener('click', () => {
  if (timerId) clearInterval(timerId);
  if (!selectedDate || isTimerRunning) return;

  isTimerRunning = true;
  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = selectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      isTimerRunning = false;
      updateClock({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateInput.disabled = false;
      return;
    }

    const time = convertMs(diff);
    updateClock(time);
  }, 1000);
});

function updateClock({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
