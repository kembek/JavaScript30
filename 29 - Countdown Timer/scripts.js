let countDown;
const timeTitle = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    clearInterval(countDown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);

    countDown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft <= 0) {
            displayTimeLeft(secondsLeft);
            clearInterval(countDown);
            return;
        }
        displayTimeLeft(secondsLeft);


    }, 1000);

}

function displayTimeLeft(seconds) {

    if (!seconds) {

        timeTitle.textContent = "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const second = seconds % 60;
    const display = (`${minutes}:${second < 10 ? `0${second}` : second}`);

    document.title = display;
    timeTitle.textContent = display;

}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const pmHour = hour > 12 ? hour - 12 : hour;
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${pmHour}:${minutes < 10 ? `0${minutes}` : minutes} ${hour > 12 ? 'pm' : 'am'}`;
}


buttons.forEach(button => button.addEventListener('click', handleButton));

function handleButton() {
    const seconds = this.dataset.time;
    timer(seconds);
}

document.customForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const seconds = this.minutes.value * 60;
    timer(seconds);
    this.reset();
})