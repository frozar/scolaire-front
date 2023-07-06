import InformationContent from "./InformationContent";

import { useStateGui } from "../../../../StateGui";

import { InformationBoardTabType } from "../../../../type";
import InformationCircleIcon from "./component/atom/InformationCircleIcon";
import SettingsIcon from "./component/atom/SettingsIcon";
import InformationBoardSettings from "./component/molecule/InformationBoardSettings";
import { InformationBoard } from "./component/organisme/InformationBoard";

const [, { getDisplayedInformationBoard, getDisplayedLeftMenu }] =
  useStateGui();

export function LateralInformationBoard() {
  let refMenuContent!: HTMLDivElement;

  const tabs: InformationBoardTabType[] = [
    {
      icon: InformationCircleIcon,
      content: InformationContent,
      label: "Informations",
    },
    {
      icon: SettingsIcon,
      content: InformationBoardSettings,
      label: "Paramètres",
    },
  ];

  return (
    <div
      ref={refMenuContent}
      class="menu__custom"
      classList={{
        _active: getDisplayedLeftMenu(),
        active: getDisplayedInformationBoard(),
      }}
    >
      <InformationBoard tabs={tabs} />
    </div>
  );
}
