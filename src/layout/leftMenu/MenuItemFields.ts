import ArretsLogo from "./logo/ArretsLogo";
// import LateralMenuDashboardLogo from "./logo/LateralMenuDashboardLogo";
import EtablissementLogo from "./logo/EtablissementLogo";
import GraphicageLogo from "./logo/GraphicageLogo";
// import LateralMenuSettingsLogo from "./logo/LateralMenuSettingsLogo";
// import LateralMenuSupportLogo from "./logo/LateralMenuSupportLogo";
// import LateralMenuVoirieLogo from "./logo/LateralMenuVoirieLogo";
import { MenuItemType } from "../../type";

export default function (displayText: boolean) {
  const menuItems: MenuItemType[] = [
    // {
    //   title: "Dashboard",
    //   menuItem: "dashboard",
    //   Logo: LateralMenuDashboardLogo,
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
    //   Logo: LateralMenuVoirieLogo,
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
    //   Logo: LateralMenuSettingsLogo,
    //   displayText: displayText,
    // },
    // {
    //   title: "Support",
    //   menuItem: "support",
    //   Logo: LateralMenuSupportLogo,
    //   displayText: displayText,
    // },
  ];
  return menuItems;
}
