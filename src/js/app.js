export function forTest() {
  return 5;
}

let btnsAdd = document.querySelectorAll(".block");
let actualElem;
let actualElemXY;
let lastMouseElem;
let newBlock;
let mouseUpItem;

// Создаем прозрачный элемент-заглушку
let new_elem_opasity = createNewCard("Заглушка");
new_elem_opasity.style.opacity = 0;
new_elem_opasity.classList.add("unvis");

// Обработчик для нажатия на карточку
const mouseDown = (e) => {
  e.preventDefault();

  actualElem = e.target.closest(".card");
  if (!actualElem) return;

  // Удаление карточки, если клик по кнопке удаления
  if (actualElem.querySelector(".card_delete") === e.target) {
    actualElem.remove();
    saveToLocalStorage();
  } else {
    newBlock = e.target.closest(".block");

    // Определяем позицию заглушки
    mouseUpItem =
      actualElem.nextSibling &&
      actualElem.nextSibling.classList.contains("card")
        ? actualElem.nextSibling
        : newBlock.querySelector(".body--cards");

    new_elem_opasity.innerHTML = actualElem.innerHTML;
    actualElem.insertAdjacentElement("afterend", new_elem_opasity);

    actualElemXY = [
      e.clientX - actualElem.offsetLeft,
      e.clientY - actualElem.offsetTop,
    ];

    actualElem.classList.add("dragged");

    // Добавляем обработчики перемещения и отпускания
    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mousemove", onMouseOver);
  }
};

// Создание новой карточки
function createNewCard(text) {
  const elem = document.createElement("div");
  elem.classList.add("card");
  elem.insertAdjacentHTML(
    "beforeend",
    `<div class="card_text">${text}</div>
     <button class="card_delete">&#215;</button>`,
  );

  // Добавляем анимацию удаления
  const button = elem.querySelector(".card_delete");
  button.style.opacity = 0;

  elem.addEventListener("mouseover", () => {
    button.style.opacity = 1;
  });
  elem.addEventListener("mouseout", () => {
    button.style.opacity = 0;
  });
  return elem;
}

// Переключение видимости формы и кнопки
function toggleMove(elem1, elem2) {
  elem1.classList.toggle("unvisible");
  elem2.classList.toggle("unvisible");
}

// Обработка формы добавления карточки
function formOnSubmit(e, form, bodyCards, btn) {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const card = createNewCard(textarea.value);
  bodyCards.append(card);
  toggleMove(btn, form);
  textarea.value = "";
  saveToLocalStorage();
}

// Обновление позиции карточки при движении мыши
const onMouseOver = (e) => {
  requestAnimationFrame(() => {
    actualElem.style.left = `${e.clientX - actualElemXY[0]}px`;
    actualElem.style.top = `${e.clientY - actualElemXY[1]}px`;

    newBlock = e.target.closest(".block");
    const mouseHoverCard = e.target.closest(".card");

    if (mouseHoverCard) {
      if (mouseHoverCard.offsetHeight / 2 <= e.y - mouseHoverCard.offsetTop) {
        mouseHoverCard.insertAdjacentElement("afterend", new_elem_opasity);
      } else {
        mouseHoverCard.insertAdjacentElement("beforebegin", new_elem_opasity);
      }
      mouseUpItem = mouseHoverCard;
      return;
    }

    if (newBlock && newBlock !== lastMouseElem) {
      mouseUpItem = newBlock.querySelector(".body--cards");
      mouseUpItem.appendChild(new_elem_opasity);
      lastMouseElem = newBlock;
    }
  });
};

// Завершение перемещения карточки
const onMouseUp = (e) => {
  if (mouseUpItem) {
    const elem = createNewCard(
      actualElem.querySelector(".card_text").textContent,
    );

    if (mouseUpItem.classList.contains("card")) {
      if (mouseUpItem.offsetHeight / 2 <= e.y - mouseUpItem.offsetTop) {
        mouseUpItem.insertAdjacentElement("afterend", elem);
      } else {
        mouseUpItem.insertAdjacentElement("beforebegin", elem);
      }
    } else {
      mouseUpItem.append(elem);
    }

    saveToLocalStorage();
    actualElem.remove();
  } else {
    actualElem.removeAttribute("style");
  }

  new_elem_opasity.remove();
  actualElem.classList.remove("dragged");

  // Очистка переменных и событий
  actualElem = undefined;
  lastMouseElem = undefined;
  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mousemove", onMouseOver);
};

// Сохранение данных в localStorage
function saveToLocalStorage() {
  const blockData = {};
  const blocks = document.querySelectorAll(".block");
  blocks.forEach((block) => {
    const cards = Array.from(block.querySelectorAll(".card_text")).map(
      (card) => card.textContent,
    );
    blockData[block.querySelector("h2").textContent] = cards;
  });
  localStorage.setItem("blockData", JSON.stringify(blockData));
}

// Восстановление данных из localStorage
document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("blockData");
  let formData;
  try {
    formData = JSON.parse(json);
  } catch (error) {
    console.log("Ошибка парсинга данных", error);
  }

  if (formData) {
    Object.keys(formData).forEach((title) => {
      const place = document
        .querySelector(`[name="${title}"]`)
        .querySelector(".body--cards");
      formData[title].forEach((text) => {
        const elem = createNewCard(text);
        place.append(elem);
      });
    });
  }
});

// Инициализация событий для блоков
for (const elem of btnsAdd) {
  const btn = elem.querySelector(".add--btn");
  const form = elem.querySelector(".add--card--form");
  const formBackBtn = elem.querySelector(".back--btn");
  const bodyCards = elem.querySelector(".body--cards");

  btn.addEventListener("click", () => toggleMove(btn, form));
  formBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMove(btn, form);
  });
  form.addEventListener("submit", (e) => formOnSubmit(e, form, bodyCards, btn));
  bodyCards.addEventListener("mousedown", mouseDown);
}
