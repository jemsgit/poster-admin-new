export function processContentItemClick(e: MouseEvent) {
  const text = (e.target as HTMLElement).innerText;
  const link = text.match(/http(s*):\/\/[^\s]+/g);
  if (link) {
    const aEl = document.createElement("a");
    aEl.setAttribute("href", link[0]);
    aEl.setAttribute("target", "_blank");
    aEl.click();
  }
}

export function isParentEditable(el: HTMLElement) {
  const parent = el.parentElement;
  return parent && parent.getAttribute("contentEditable");
}

// Improved: Two-click selection for 'copy to' (first click = start, second click = end)
export function getSelectionRange(
  el: HTMLElement,
  currentRange: [number | null, number | null]
): [number | null, number | null] {
  if (!isParentEditable(el)) return currentRange;
  const contentArray = Array.from(el.parentElement!.children);
  const clickedIndex = contentArray.findIndex((item) => item === el);
  // If no start, set start
  if (currentRange[0] === null) {
    return [clickedIndex, null];
  }
  // If start exists and no end, set end
  if (currentRange[1] === null) {
    // If user clicks same line, treat as single line selection
    if (clickedIndex === currentRange[0]) {
      return [clickedIndex, clickedIndex];
    }
    return [currentRange[0], clickedIndex];
  }
  // If both start and end exist, reset selection to new start
  return [clickedIndex, null];
}

export function updateSelectedElements(
  currentRange: [number | null, number | null],
  container: HTMLElement,
  className: string
) {
  const [start, end] = currentRange;
  const elements = container.children;
  Array.from(elements).forEach((item) => item.classList.remove(className));
  if (start !== null && end !== null) {
    const from = Math.min(start, end);
    const to = Math.max(start, end);
    for (let i = from; i <= to; i++) {
      elements[i].classList.add(className);
    }
  } else if (start !== null) {
    elements[start].classList.add(className);
  }
}

export function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
