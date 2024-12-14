let btnsAdd = document.querySelectorAll(".block");
let actualElem;
let actualElemXY;
let lastMouseElem;
let newBlock;
let mouseUpItem;
let new_elem_opasity = createNewCard("213452345");
new_elem_opasity.style.opacity = 0;
new_elem_opasity.classList.add("unvis");

const mouseDown = (e) => {
  e.preventDefault();

  actualElem = e.target.closest(".card");
  if (actualElem.querySelector(".card_delete") === e.target) {
    actualElem.remove();
  } else {
    newBlock = e.target.closest(".block");
    console.log(actualElem.nextSibling);
    mouseUpItem =
      actualElem.nextSibling && actualElem.nextSibling.classList.value == "card"
        ? actualElem.nextSibling
        : newBlock.querySelector(".body--cards");
    console.log(mouseUpItem.offsetTop);
    new_elem_opasity.innerHTML = actualElem.innerHTML;
    // console.log(newBlock.querySelectorAll(".card").indexOf(actualElem))
    actualElem.insertAdjacentElement("afterend", new_elem_opasity);
    // actualElem.insertAdjacentElement('beforebegin', new_elem_opasity)

    actualElemXY = [
      e.clientX - actualElem.offsetLeft,
      e.clientY - actualElem.offsetTop,
    ];

    // if (actualElem.offsetHeight / 2 <= e.y - actualElem.offsetTop) {
    //   new_elem_opasity = actualElem.insertAdjacentElement(
    //     "beforebegin",
    //     new_elem_opasity,
    //   );
    // } else {
    //   new_elem_opasity = actualElem.insertAdjacentElement(
    //     "afterend",
    //     new_elem_opasity,
    //   );
    // }

    // console.log(newBlock.querySelectorAll(".card")[1])
    // newBlock.find(actualElem).insertAdjacentElement('beforeend', new_elem_opasity)
    // newBlock.querySelector(".body--cards").append(new_elem_opasity);
    // if (mouseUpItem.closest(''))
    // if (e.target.classList.value == "card") {
    //   console.log("caaaard")
    //   mouseUpItem = e.target;
    // } else {
    //   console.log("sqadopiufhq")
    // }
    actualElem.classList.add("dragged");
    document.documentElement.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mousemove", onMouseOver);
  }
};

function createNewCard(text) {
  const elem = document.createElement("div");
  elem.classList.add("card");
  const content = `<div class="card_text">${text}</div>
        <button class="card_delete">&#215;</button>`;
  elem.insertAdjacentHTML("beforeend", content);
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

function toogleMove(elem1, elem2) {
  elem1.classList.toggle("unvisible");
  elem2.classList.toggle("unvisible");
}

function formOnSubmit(e, form, bodyCards, btn) {
  e.preventDefault();
  let textarea = form.querySelector("textarea");
  const card = createNewCard(textarea.value);
  bodyCards.append(card);
  toogleMove(btn, form);
  textarea.value = "";
}

for (const elem of btnsAdd) {
  let btn = elem.querySelector(".add--btn");
  let form = elem.querySelector(".add--card--form");
  let formBackBtn = elem.querySelector(".back--btn");
  let bodyCards = elem.querySelector(".body--cards");
  btn.addEventListener("click", () => {
    toogleMove(btn, form);
  });

  formBackBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toogleMove(btn, form);
  });

  form.addEventListener("submit", (e) => {
    formOnSubmit(e, form, bodyCards, btn);
  });

  bodyCards.addEventListener("mousedown", mouseDown);
}

const onMouseOver = (e) => {
  actualElem.style.left = `${e.clientX - actualElemXY[0]}px`;
  actualElem.style.top = `${e.clientY - actualElemXY[1]}px`;
  newBlock = e.target.closest(".block");
  const mouseHoverCard = e.target.closest(".card");
  console.log(
    mouseUpItem.offsetHeight / 2 <= e.y - mouseUpItem.offsetTop,
    mouseHoverCard,
  );

  if (mouseHoverCard) {
    console.log(mouseHoverCard.offsetTop);
    console.log(mouseUpItem.offsetTop);
    if (mouseHoverCard.offsetHeight / 2 <= e.y - mouseHoverCard.offsetTop) {
      new_elem_opasity = mouseHoverCard.insertAdjacentElement(
        "afterend",
        new_elem_opasity,
      );
    } else {
      new_elem_opasity = mouseHoverCard.insertAdjacentElement(
        "beforebegin",
        new_elem_opasity,
      );
    }
    mouseUpItem = mouseHoverCard;
    return;
  }

  if (newBlock && newBlock !== lastMouseElem) {
    mouseUpItem = newBlock.querySelector(".body--cards");
    new_elem_opasity = newBlock
      .querySelector(".body--cards")
      .appendChild(new_elem_opasity);

    lastMouseElem = newBlock;
  }
};

const onMouseUp = (e) => {
  if (mouseUpItem) {
    const elem = createNewCard(
      actualElem.querySelector(".card_text").textContent,
    );

    if (mouseUpItem.classList.value == "card") {
      if (mouseUpItem.offsetHeight / 2 <= e.y - mouseUpItem.offsetTop) {
        mouseUpItem.insertAdjacentElement("afterend", elem);
      } else {
        mouseUpItem.insertAdjacentElement("beforebegin", elem);
      }
    } else {
      mouseUpItem.append(elem);
    }

    actualElem.remove();
  } else {
    actualElem.removeAttribute("style");
  }

  new_elem_opasity ? new_elem_opasity.remove() : new_elem_opasity;

  actualElem.classList.remove("dragged");

  actualElem = undefined;
  lastMouseElem = undefined;
  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mousemove", onMouseOver);
};

window.addEventListener("beforeunload", () => {
  const blockData = {};
  const blocks = document.querySelectorAll(".block");
  for (const elem of blocks) {
    const readyText = [];
    for (const card of elem.querySelectorAll(".card_text")) {
      readyText.push(card.textContent);
    }
    blockData[elem.querySelector("h2").textContent] = readyText;
  }

  localStorage.setItem("blockData", JSON.stringify(blockData));
});

document.addEventListener("DOMContentLoaded", () => {
  const json = localStorage.getItem("blockData");
  let formData;
  try {
    formData = JSON.parse(json);
  } catch (error) {
    console.log("Error", error);
  }

  if (formData) {
    Object.keys(formData).forEach((el) => {
      const place = document
        .querySelector(`[name="${el}"]`)
        .querySelector(".body--cards");
      for (const value of formData[el]) {
        const elem = createNewCard(value);
        place.append(elem);
      }
    });
  }
});
