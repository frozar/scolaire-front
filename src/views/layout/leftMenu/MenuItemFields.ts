import ArretsLogo from "../../../component/atom/ArretsLogo";
import EtablissementLogo from "../../../component/atom/EtablissementLogo";
import GraphicageLogo from "../../../component/atom/GraphicageLogo";
import { MenuItemType } from "../../../type";

export default function (displayText: boolean) {
  const menuItems: MenuItemType[] = [
    {
      label: "Graphicage",
      menuItem: "graphicage",
      Logo: GraphicageLogo,
      displayedLabel: displayText,
    },
    {
      label: "Établissements",
      menuItem: "etablissements",
      Logo: EtablissementLogo,
      displayedLabel: displayText,
    },
    {
      label: "Arrêts",
      menuItem: "ramassages",
      Logo: ArretsLogo,
      displayedLabel: displayText,
    },
  ];
  return menuItems;
}
