// export const rolarEl = (id: string, block?: ScrollLogicalPosition) => {
//   const el = document.querySelector(`#${id}`);
//   if (el) {
//     const container = getScrollParent(el as HTMLElement);
//     if (container) {
//       const y = el.offsetTop - 80; // offset do header
//       container.scrollTo({ top: y, behavior: "smooth" });
//     } else {
//       el.scrollIntoView({
//         behavior: "smooth",
//         block: block ?? "nearest",
//       });
//     }
//   }
// };

// function getScrollParent(el: HTMLElement): HTMLElement | Window {
//   let parent = el.parentElement;

//   while (parent) {
//     const style = getComputedStyle(parent);
//     const overflowY = style.overflowY;

//     if (overflowY === "auto" || overflowY === "scroll") {
//       return parent;
//     }

//     parent = parent.parentElement;
//   }

//   return window; // Se não achar, retorna a janela principal
// }

export const rolarEl = (id: string, block?: ScrollLogicalPosition) => {
  const el = document.querySelector<HTMLElement>(`#${id}`);
  if (el) {
    const container = getScrollParent(el);
    if (container instanceof HTMLElement) {
      const y = el.offsetTop; // offset do header
      container.scrollTo({ top: y, behavior: "smooth" });
    } else {
      el.scrollIntoView({
        behavior: "smooth",
        block: block ?? "nearest",
      });
    }
  }
};

function getScrollParent(el: HTMLElement): HTMLElement | Window {
  let parent = el.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;

    if (overflowY === "auto" || overflowY === "scroll") {
      return parent;
    }

    parent = parent.parentElement;
  }

  return window; // Se não achar, retorna a janela principal
}

// export const rolarEl = (id: string) => {
//   const el = document.getElementById(id);
//   if (!el) return;

//   const yOffset = -80; // altura do header fixo
//   const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

//   window.scrollTo({ top: y, behavior: "smooth" });
// };
