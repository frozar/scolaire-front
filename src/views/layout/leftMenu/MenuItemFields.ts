import ArretsLogo from "../../../component/atom/ArretsLogo";
// import DashboardLogo from "./logo/DashboardLogo";
import EtablissementLogo from "../../../component/atom/EtablissementLogo";
import GraphicageLogo from "../../../component/atom/GraphicageLogo";
// import SettingsLogo from "./logo/SettingsLogo";
// import SupportLogo from "./logo/SupportLogo";
// import VoirieLogo from "./logo/VoirieLogo";
import { MenuItemType } from "../../../type";

export default function (displayText: boolean) {
  const menuItems: MenuItemType[] = [
    // {
    //   title: "Dashboard",
    //   menuItem: "dashboard",
    //   Logo: DashboardLogo,
    //   displayText: displayText,
    // },
    {
      label: "Graphicage",
      menuItem: "graphicage",
      Logo: GraphicageLogo,
      displayedLabel: displayText,
    },
    // {
    //   title: "Voirie",
    //   menuItem: "voirie",
    //   Logo: VoirieLogo,
    //   displayText: displayText,
    // },
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
    // {
    //   title: "Paramètres",
    //   menuItem: "parametres",
    //   Logo: SettingsLogo,
    //   displayText: displayText,
    // },
    // {
    //   title: "Support",
    //   menuItem: "support",
    //   Logo: SupportLogo,
    //   displayText: displayText,
    // },
  ];
  return menuItems;
}
