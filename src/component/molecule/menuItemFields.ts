import DashboardLogo from "../atom/DashboardLogo";
import GraphicageLogo from "../atom/GraphicageLogo";
import EtablissementLogo from "../atom/EtablissementLogo";
import ArretsLogo from "../atom/ArretsLogo";
import SettingsLogo from "../atom/SettingsLogo";
import SupportLogo from "../atom/SupportLogo";
import VoirieLogo from "../atom/VoirieLogo";
import { MenuItemType } from "../../type";

// export default function () {
const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: true,
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
  },
  {
    menuItem: "etablissements",
    Logo: EtablissementLogo,
    label: "Établissements",
    isDisabled: false,
  },
  {
    menuItem: "ramassages",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
  },
  {
    menuItem: "voirie",
    Logo: VoirieLogo,
    label: "Voirie",
    isDisabled: true,
  },
  {
    menuItem: "parametres",
    Logo: SettingsLogo,
    label: "Paramètres",
    isDisabled: true,
  },
  {
    menuItem: "support",
    Logo: SupportLogo,
    label: "Support",
    isDisabled: true,
  },
];
// return menuItems;
//

export default menuItems;
