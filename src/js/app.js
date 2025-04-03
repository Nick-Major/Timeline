import { reject, resolve } from "core-js/es/promise";
import parseCoordinates from "./parseCoordinates";

const container = document.querySelector('.container');
const postList = container.querySelector('.post-list');
const form = container.querySelector('.form');
const input = form.querySelector('.input');

// Элементы модального окна
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <h3>Что-то пошло не так</h3>
    <p>К сожалению, нам не удалось определить ваше 
    местоположение, пожалуйста, дайте разрешение на 
    использование геолокации, либо введите координаты вручную</p>
    <label for="coords-input">Широта и долгота через запятую</label>
    <input type="text" class="coords-input" id="coords-input" placeholder="51.50851, -0.12572">
    <div class="error-message" style="color: red; margin: 5px 0;"></div>
    <div class="modal-btns-container">
      <button class="cancel-coords">Отмена</button>
      <button class="submit-coords">Ок</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

function getCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается вашим браузером'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const coordinates = {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
          };
          resolve(coordinates);
        },
        (err) => {
          // При отказе показываем модальное окно
          showManualCoordsModal().then(resolve).catch(reject);
        }
      );
    }
  });
}

function showManualCoordsModal() {
  return new Promise((resolve, reject) => {
    modal.style.display = 'block';
    const errorMessage = modal.querySelector('.error-message');
    errorMessage.textContent = '';
    
    const submitBtn = modal.querySelector('.submit-coords');
    const cancelBtn = modal.querySelector('.cancel-coords');
    const coordsInput = modal.querySelector('.coords-input');
    coordsInput.value = '';
    
    const cleanup = () => {
      submitBtn.removeEventListener('click', handleSubmit);
      cancelBtn.removeEventListener('click', handleCancel);
      modal.style.display = 'none';
    };
    
    const handleSubmit = () => {
      try {
        const coords = parseCoordinates(coordsInput.value);
        cleanup();
        resolve(coords);
      } catch (error) {
        errorMessage.textContent = error.message;
      }
    };
    
    const handleCancel = () => {
      cleanup();
      reject(new Error('Пользователь отменил ввод координат'));
    };
    
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    
    // Обработка нажатия Enter
    coordsInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });
  });
}

async function fetchCoordinates() {
  try {
    const coords = await getCoords();
    console.log("Координаты:", coords);
    return coords;
  } catch (error) {
    console.error("Ошибка:", error.message);
    throw error;
  }
}

function createPostElement(inputValue, coords) {
  const post = document.createElement('div');
  post.classList.add('post');

  const text = document.createElement('div');
  text.textContent = inputValue;
  text.classList.add('text');

  const coordsElement = document.createElement('div');
  coordsElement.classList.add('coords');
  coordsElement.textContent = `Широта: ${coords.latitude.toFixed(5)}, Долгота: ${coords.longitude.toFixed(5)}`;

  post.appendChild(text);
  post.appendChild(coordsElement);
  
  return post;
}

async function createPostWithCoords(inputValue) {
  try {
    const userCoords = await fetchCoordinates();
    return createPostElement(inputValue, userCoords);
  } catch (error) {
    console.error('Не удалось получить координаты:', error.message);
    throw error;
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = input.value.trim();
  
  if (!value) {
    alert('Пожалуйста, введите текст поста');
    return;
  }

  try {
    const postElement = await createPostWithCoords(value);
    // Вставляем новый пост в начало списка
    postList.insertBefore(postElement, postList.firstChild);
    input.value = '';
  } catch (error) {
    console.error('Ошибка:', error);
    // Показываем ошибку через alert вместо создания DOM-элемента
    alert('Не удалось создать пост: ' + error.message);
    input.value = '';
  }
});
