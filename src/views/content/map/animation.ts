import { deepCopy } from "../../../utils";

const circleTimeoutId = new Map();

let timeoutIdRemoveHighlightInit: NodeJS.Timeout;
let timeouIdtRemoveTransitionInit: NodeJS.Timeout;

export function renderAnimation(element: Element) {
  if (!circleTimeoutId.has(element)) {
    circleTimeoutId.set(
      element,
      deepCopy({
        timeoutIdRemoveHighlight: timeoutIdRemoveHighlightInit,
        timeouIdtRemoveTransition: timeouIdtRemoveTransitionInit,
      })
    );
  }

  let { timeoutIdRemoveHighlight, timeouIdtRemoveTransition } =
    circleTimeoutId.get(element);

  if (timeoutIdRemoveHighlight) {
    element.classList.remove("highlight-point");
    clearTimeout(timeoutIdRemoveHighlight);
  }
  if (timeouIdtRemoveTransition) {
    clearTimeout(timeouIdtRemoveTransition);
    element.classList.remove("transition-all");
    for (const animation of element.getAnimations()) {
      animation.finish;
    }
  }

  element.classList.add("highlight-point");
  timeoutIdRemoveHighlight = setTimeout(() => {
    clearTimeout(timeoutIdRemoveHighlight);
    element.classList.add("transition-all");
    element.classList.remove("highlight-point");
    timeouIdtRemoveTransition = setTimeout(() => {
      clearTimeout(timeouIdtRemoveTransition);
      element.classList.remove("transition-all");
    }, 1000);
    circleTimeoutId.set(element, {
      ...circleTimeoutId.get(element),
      timeouIdtRemoveTransition,
    });
  }, 0);
  circleTimeoutId.set(element, {
    ...circleTimeoutId.get(element),
    timeoutIdRemoveHighlight,
  });
}
