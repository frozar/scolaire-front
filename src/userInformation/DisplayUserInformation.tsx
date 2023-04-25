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

export default function () {
  return (
    <div class="d-user-informations">
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
