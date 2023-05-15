import {
  LateralMenuArretsLogo,
  LateralMenuDashboardLogo,
  LateralMenuEtablissementLogo,
  LateralMenuGraphicageLogo,
  LateralMenuSettingsLogo,
  LateralMenuSupportLogo,
  LateralMenuVoirieLogo,
} from "../export/Logos";
import { MenuItemType } from "../type";

export default function (displayText: boolean) {
  const menuItems: MenuItemType[] = [
    {
      title: "Dashboard",
      menuItem: "dashboard",
      Logo: LateralMenuDashboardLogo,
      displayText: displayText,
    },
    {
      title: "Graphicage",
      menuItem: "graphicage",
      Logo: LateralMenuGraphicageLogo,
      displayText: displayText,
    },
    {
      title: "Voirie",
      menuItem: "voirie",
      Logo: LateralMenuVoirieLogo,
      displayText: displayText,
    },
    {
      title: "Établissements",
      menuItem: "etablissements",
      Logo: LateralMenuEtablissementLogo,
      displayText: displayText,
    },
    {
      title: "Arrêts",
      menuItem: "arrets",
      Logo: LateralMenuArretsLogo,
      displayText: displayText,
    },
    {
      title: "Paramètres",
      menuItem: "parametres",
      Logo: LateralMenuSettingsLogo,
      displayText: displayText,
    },
    {
      title: "Support",
      menuItem: "support",
      Logo: LateralMenuSupportLogo,
      displayText: displayText,
    },
  ];
  return menuItems;
}
