window.addEventListener("DOMContentLoaded", () => {

  // Toggle menu

  const accordion = document.querySelector('.accordion'),
    panel = document.querySelector('.panel'),
    toggle = document.getElementById('toggle');

  toggle.addEventListener('click', () => {
    accordion.classList.toggle('active');
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });

  // Select region

  // const region = document.querySelector('#region')
  const region = document.getElementById('region')
  const reg = document.getElementById('reg')
  const regions = document.querySelectorAll('li')

  regions.forEach(item => {
    item.addEventListener('click', (e) => {
      region.innerHTML = e.target.innerText;
      panel.style.maxHeight = null;
      accordion.classList.remove('active')
    });
  });

  // Date and time

  const hour = document.getElementById('hour');
  const newDate = document.querySelector('.date');

  updateDate();
  function updateDate() {
    const date = new Date();
    const newHour = date.getHours();
    const newMinute = date.getMinutes();
    const newSecond = date.getSeconds();

    hour.innerHTML = getZero(newHour) + ":" + getZero(newMinute) + ":" + getZero(newSecond);

    setTimeout(updateDate, 1000);
    newDate.innerHTML = dateBuilder(date);
  }
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  function dateBuilder(a) {
    let months = [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentabr",
      "Oktabr",
      "Noyabr",
      "Dekabr",
    ];
    let weekDays = [
      "Yakshanba",
      "Dushanba",
      "Seshanba",
      "Chorshanba",
      "Payshanba",
      "Juma",
      "Shanba",
    ];
    let haftaKunlari = weekDays[a.getDay()];
    let sana = a.getDate();
    let oyNomi = months[a.getMonth()];
    return `${haftaKunlari}, ${sana}-${oyNomi}`
  }

  // Hijriy yil

  const hijriy = document.getElementById('hijriy')
  const hijriyYil = new Intl.DateTimeFormat("en-EU-u-ca-islamic", {
    day: 'numeric',
    year: 'numeric',
    month: 'long'
  }).format(Date.now());
  hijriy.innerHTML = hijriyYil;

  // Namoz vaqtlari 

  const prayTimes = document.querySelectorAll('.pray-time');

  const api = {
    baseurl: 'https://islomapi.uz/api/present/'
  };
  getResult(reg.innerText)

  async function getResult(query) {
    const res = await fetch(`${api.baseurl}day?region=${query}`)
    const result = await res.json()
    // console.log(result);
    displayResult(result)
  }
  regions.forEach(region => {
    region.addEventListener('click', (e) => {
      getResult(e.target.innerHTML)
    });
  });

  function displayResult(time) {
    // console.log(Object.values(time.times));
    reg.innerHTML = time.region;

    prayTimes.forEach((item, index) => {
      item.innerHTML = Object.values(time.times)[index];
    });
    removeCardActive();
  }

  // Active time

  const cards = document.querySelectorAll('.card');
  const date = new Date();
  const newHour = date.getHours();
  const newMinute = date.getMinutes();
  const newSecond = date.getSeconds();

  const nowTime = getZero(newHour) + ":" + getZero(newMinute);

  function removeCardActive() {
    let currentTimeToString = nowTime.split(":").join("")

    // console.log(currentTimeToString);

    const newArray = [];

    prayTimes.forEach(item => {
      newArray.push(item.innerHTML.split(':').join(""))
    });

    // console.log(newArray);

    let number = newArray.reverse().find((e) => e <= currentTimeToString);

    // console.log(number);

    newArray.sort(function (a, b) {
      return a - b;
    });

    const ActiveCardIndex = newArray.indexOf(number);

    // console.log(ActiveCardIndex);

    cards.forEach((card) => {
      card.classList.remove('active');
    });

    if (currentTimeToString >= '0000' && currentTimeToString < newArray[0]) {
      cards.forEach((card) => {
        card.classList.remove('active');
      });
      cards[5].classList.add('active')
    } else {
      cards[ActiveCardIndex].classList.add('active');
    }
  }
});