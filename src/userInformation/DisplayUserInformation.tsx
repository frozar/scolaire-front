import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { getUserInformation } from "../signaux";
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
  const show = () => getUserInformation()["content"] !== null;

  return (
    <Show when={show()}>
      <div class="absolute top-[20px] z-[999] w-full flex justify-center">
        <Dynamic component={options[getUserInformation()["level"]]}>
          {getUserInformation()["content"]}
        </Dynamic>
      </div>
    </Show>
  );
}
