import { Show } from "solid-js";

import logoAnimated from "../assets/logo-animated.svg";
import { displayedSpinningWheel } from "../signaux";

export default function () {
  return (
    <Show when={displayedSpinningWheel()}>
      <div id="spinning-wheel-container">
        <span>
          <img id="spinning-wheel-image" src={logoAnimated} />
        </span>
      </div>
    </Show>
  );
}
