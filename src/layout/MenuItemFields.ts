import LateralMenuArretsLogo from "./logo/LateralMenuArretsLogo";
import LateralMenuDashboardLogo from "./logo/LateralMenuDashboardLogo";
import LateralMenuEtablissementLogo from "./logo/LateralMenuEtablissementLogo";
import LateralMenuGraphicageLogo from "./logo/LateralMenuGraphicageLogo";
import LateralMenuSettingsLogo from "./logo/LateralMenuSettingsLogo";
import LateralMenuSupportLogo from "./logo/LateralMenuSupportLogo";
import LateralMenuVoirieLogo from "./logo/LateralMenuVoirieLogo";
import { MenuItemType } from "../type";

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
      Logo: LateralMenuGraphicageLogo,
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
      Logo: LateralMenuEtablissementLogo,
      displayText: displayText,
    },
    {
      title: "Arrêts",
      menuItem: "ramassages",
      Logo: LateralMenuArretsLogo,
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
