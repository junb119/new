const $text = document.querySelector(".text");
const letters = ["html", "css", "javascript"];
const speed = 100;

let i = 0;
function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

const typing = async () => {
  const letter = letters[i].split("");
  while (letter.length) {
    await wait(speed);
    $text.innerHTML += letter.shift();
  }

  await wait(800);

  if (letters[i + 1]) remove();
};

const remove = async () => {
  const letter = letters[i].split("");
  while (letter.length) {
    await wait(speed);

    letter.pop();
    $text.innerHTML = letter.join("");
  }
  i++;
  if (i >= letters.length) {
    i = 0;
  }
  typing();
};

setTimeout(typing, 1500);
