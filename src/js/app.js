import { reject, resolve } from "core-js/es/promise";

const container = document.querySelector('.container');
const postList = container.querySelector('.post-list');
const form = container.querySelector('.form');
const input = form.querySelector('.input');
let userCoords;

function getCoords() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Геолокация не поддерживается вашим браузером'));
        } else {
            navigator.geolocation.getCurrentPosition(function (data) {
                const coordinates = {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude
                };
                resolve(coordinates);
            }, function (err) {
                reject(err);
            });
        }
    });
};

async function fetchCoordinates() {
    try {
      const coords = await getCoords();
      console.log("Координаты:", coords);
      return coords;
    } catch (error) {
      console.error("Ошибка:", error.message);
    }
};

function createPostWithCoords(inputValue) {
    return new Promise((resolve, reject) => {
      // Получаем координаты
      fetchCoordinates()
        .then((userCoords) => {
          try {
            // Создаём элементы DOM
            const post = document.createElement('div');
            post.classList.add('post');
  
            const text = document.createElement('div');
            text.textContent = inputValue;
            text.classList.add('text');
  
            const coords = document.createElement('div');
            coords.classList.add('coords');
            coords.textContent = `Широта: ${userCoords.latitude}, Долгота: ${userCoords.longitude}`;
  
            // Собираем структуру
            post.appendChild(text);
            post.appendChild(coords);
            
            // Возвращаем готовый элемент
            resolve(post);
          } catch (error) {
            reject(new Error('Ошибка при создании элемента: ' + error.message));
          }
        })
        .catch((error) => {
          reject(new Error('Не удалось получить координаты: ' + error.message));
        });
    });
  }

form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const value = input.value;

    createPostWithCoords(value)
    .then((postElement) => {
        postList.appendChild(postElement);
    })
    .catch((error) => {
        console.error('Ошибка:', error);
        // Можно добавить уведомление пользователю
        const errorElement = document.createElement('div');
        errorElement.textContent = 'Не удалось создать пост с координатами';
        postList.appendChild(errorElement);
    });

    input.value = '';
})
