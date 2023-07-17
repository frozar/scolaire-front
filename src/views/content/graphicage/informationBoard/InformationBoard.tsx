import { JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import InformationCircleIcon from "../component/atom/InformationCircleIcon";
import SettingsIcon from "../component/atom/SettingsIcon";
import {
  InformationBoardTabType,
  InformationBoardTabs,
} from "../component/organism/InformationBoardTabs";
import InformationContent from "./InformationContent";

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

  const tabs: (InformationBoardTabType & {
    content: (props: object) => JSXElement;
  })[] = [
    {
      id: "information",
      label: "Informations",
      icon: InformationCircleIcon,
      content: InformationContent,
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: SettingsIcon,
      content: SettingsContent,
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

      <Dynamic
        component={
          tabs.find((tab) => tab.id === getInformationBoardSelectedTab())
            ?.content
        }
      />
    </div>
  );
}
