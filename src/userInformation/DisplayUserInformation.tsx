import { For, Show } from "solid-js";
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

export default function DisplayUserInformation() {
  return (
    <div class="absolute top-[20lpx] z-[999] w-full flex flex-col items-center">
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
  );
}
