/* eslint-disable import/prefer-default-export */

function textToHtml(text: string): string {
  const divEl = document.createElement("div");
  const html = text.split(/\r\n|\r|\n/g).reduce((acc, curr) => {
    divEl.innerText = curr;
    acc.innerHTML += `<div>${divEl.innerHTML}</div>`;
    return acc;
  }, document.createElement("div"));
  return html.innerHTML;
}

function renderText(text: string) {
  let result = text;
  result = textToHtml(text);
  return result;
}

function escapeHtml(text: string) {
  const divEl = document.createElement("div");
  divEl.innerText = text;
  return divEl.innerHTML;
}

export { renderText, escapeHtml };
