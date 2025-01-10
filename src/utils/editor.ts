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

export function getSelectionRange(
  el: HTMLElement,
  currentRange: [number | null, number | null]
): [number | null, number | null] {
  if (isParentEditable(el)) {
    const contentArray = Array.from(el!.parentElement!.children);
    let currentIndex = contentArray.findIndex((item) => item === el);
    if (currentRange[0] !== null) {
      contentArray.forEach((el) => el.classList.remove("select-for-move"));
      const startIndex = currentRange[0];
      let currentIndex = contentArray.findIndex((item) => item === el);
      return [startIndex, currentIndex];
    }
    return [currentIndex, null];
  }
  return currentRange;
}

export function updateSelectedElements(
  currentRange: [number | null, number | null],
  container: HTMLElement,
  className: string
) {
  if (currentRange[0] !== null) {
    let [start, end] = currentRange;
    const elements = container.children;
    if (!end) {
      end = start;
    }
    const content = Array.from(elements);
    content.forEach((item) => item.classList.remove(className));
    if (start < end) {
      for (let i = start; i <= end; i++) {
        elements[i].classList.add(className);
      }
    } else {
      for (let i = start; i >= end; i--) {
        elements[i].classList.add(className);
      }
    }
  }
}
