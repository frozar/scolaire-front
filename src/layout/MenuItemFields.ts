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

export default function () {
  const menuItems: MenuItemType[] = [
    {
      title: "Dashboard",
      menuItem: "dashboard",
      Logo: LateralMenuDashboardLogo,
    },
    {
      title: "Graphicage",
      menuItem: "graphicage",
      Logo: LateralMenuGraphicageLogo,
    },
    {
      title: "Voirie",
      menuItem: "voirie",
      Logo: LateralMenuVoirieLogo,
    },
    {
      title: "Établissements",
      menuItem: "etablissements",
      Logo: LateralMenuEtablissementLogo,
    },
    {
      title: "Arrêts",
      menuItem: "arrets",
      Logo: LateralMenuArretsLogo,
    },
    {
      title: "Paramètres",
      menuItem: "parametres",
      Logo: LateralMenuSettingsLogo,
    },
    {
      title: "Support",
      menuItem: "support",
      Logo: LateralMenuSupportLogo,
    },
  ];
  return menuItems;
}
