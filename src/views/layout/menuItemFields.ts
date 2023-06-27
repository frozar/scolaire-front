import DashboardLogo from "./component/atom/DashboardLogo";
import GraphicageLogo from "./component/atom/GraphicageLogo";
import EtablissementLogo from "./component/atom/EtablissementLogo";
import ArretsLogo from "./component/atom/ArretsLogo";
import SettingsLogo from "./component/atom/SettingsLogo";
import SupportLogo from "./component/atom/SupportLogo";
import VoirieLogo from "./component/atom/VoirieLogo";
import { MenuItemType } from "../../type";

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
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

export default menuItems;
