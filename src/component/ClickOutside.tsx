import { onCleanup } from "solid-js";
import { assertIsNode } from "../utils";

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      ClickOutside: (e: MouseEvent) => void;
    }
  }
}

export default function (
  el: HTMLElement,
  accessor: () => (e: MouseEvent) => void
) {
  const onClick = (e: MouseEvent) => {
    if (!e.target) {
      return;
    }
    assertIsNode(e.target);
    !el.contains(e.target) && accessor()?.(e);
  };
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
