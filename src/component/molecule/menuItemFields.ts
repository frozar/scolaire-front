import ArretsLogo from "../atom/ArretsLogo";
// import DashboardLogo from "./logo/DashboardLogo";
import EtablissementLogo from "../atom/EtablissementLogo";
import GraphicageLogo from "../atom/GraphicageLogo";
// import SettingsLogo from "./logo/SettingsLogo";
// import SupportLogo from "./logo/SupportLogo";
// import VoirieLogo from "./logo/VoirieLogo";
import { MenuItemType } from "../../type";

export default function (displayText: boolean) {
  const menuItems: MenuItemType[] = [
    // {
    //   title: "Dashboard",
    //   menuItem: "dashboard",
    //   Logo: DashboardLogo,
    //   displayText: displayText,
    // },
    {
      title: "Graphicage",
      menuItem: "graphicage",
      Logo: GraphicageLogo,
      displayText: displayText,
    },
    // {
    //   title: "Voirie",
    //   menuItem: "voirie",
    //   Logo: VoirieLogo,
    //   displayText: displayText,
    // },
    {
      title: "Établissements",
      menuItem: "etablissements",
      Logo: EtablissementLogo,
      displayText: displayText,
    },
    {
      title: "Arrêts",
      menuItem: "ramassages",
      Logo: ArretsLogo,
      displayText: displayText,
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
