import { For, Show, createEffect, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";

import { getUserInformations } from "../signaux";
import { MessageLevelEnum } from "../type";
import InfoBox from "./InfoBox";
import SuccessBox from "./SuccessBox";
import WarningBox from "./WarningBox";
import ErrorBox from "./ErrorBox";

const options = {
  [MessageLevelEnum.info]: InfoBox,
  [MessageLevelEnum.success]: SuccessBox,
  [MessageLevelEnum.warning]: WarningBox,
  [MessageLevelEnum.error]: ErrorBox,
};

const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();
let refDivMessage: HTMLDivElement | undefined;
createEffect(() => {
  divRef()?.addEventListener(
    "animationend",
    () => {
      refDivMessage?.remove();
    },
    false
  );
});

export default function DisplayUserInformation() {
  return (
    <div
      class="absolute top-[20lpx] z-[999] w-full flex flex-col items-center nav-notify v-snack--active"
      ref={refDivMessage}
    >
      <div class="v-snack__wrapper" ref={setDivRef}>
        <For each={getUserInformations()}>
          {(item, i) => (
            <Show when={item.displayed}>
              <Dynamic component={options[item.level]} id={item.id}>
                {item.content}
              </Dynamic>
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
