import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { getUserInformation } from "../signaux";
import { useStateAction } from "../StateAction";
import { ModeEnum, MessageLevelEnum } from "../type";
import InfoBox from "./InfoBox";
import SuccessBox from "./SuccessBox";

const [, { getMode }] = useStateAction();

const options = {
  [MessageLevelEnum.info]: InfoBox,
  [MessageLevelEnum.success]: SuccessBox,
  [MessageLevelEnum.warning]: InfoBox,
  [MessageLevelEnum.error]: InfoBox,
};

export default function DisplayUserInformation() {
  //   createEffect(() => {
  //     console.log("getUserInformation TOTO", getUserInformation());
  //   });

  //   createEffect(() => {
  //     console.log("getMode", getMode());
  //     console.log("ModeRemoveLine ?", getMode() === ModeEnum.removeLine);
  //   });

  const show = () => getMode() === ModeEnum.removeLine;
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
