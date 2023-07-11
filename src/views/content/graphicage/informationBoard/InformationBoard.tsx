import { Dynamic } from "solid-js/web";
import InformationContent from "./InformationContent";

import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import { InformationBoardTabType } from "../../../../type";
import InformationCircleIcon from "../component/atom/InformationCircleIcon";
import SettingsIcon from "../component/atom/SettingsIcon";
import { InformationBoardTabs } from "../component/organism/InformationBoardTabs";

const [stateAction, { toggleAltimetryAnimation }] = useStateAction();
const [, { getInformationBoardSelectedTab, getDisplayedInformationBoard }] =
  useStateGui();

function SettingsContent(props: object) {
  return (
    <div>
      <input
        id="animation-setting"
        type="checkbox"
        class="mr-2"
        value="animation"
        checked={stateAction.altimetry.animation}
        onChange={() => {
          toggleAltimetryAnimation();
        }}
        {...props}
      />
      <label for="animation-setting">Animations</label>
    </div>
  );
}

export function InformationBoard() {
  let refMenuContent!: HTMLDivElement;

  const tabs: InformationBoardTabType[] = [
    {
      icon: InformationCircleIcon,
      content: InformationContent,
      label: "Informations",
    },
    {
      icon: SettingsIcon,
      content: SettingsContent,
      label: "Paramètres",
    },
  ];

  return (
    <div
      ref={refMenuContent}
      class="menu__custom"
      classList={{
        active: getDisplayedInformationBoard(),
      }}
    >
      <InformationBoardTabs tabs={tabs} />

      <Dynamic component={tabs[getInformationBoardSelectedTab()].content} />
    </div>
  );
}
