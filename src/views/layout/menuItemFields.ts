import { createSignal } from "solid-js";
import { useStateGui } from "../../StateGui";
import { MenuItemType } from "../../type";
import ArretsLogo from "./component/atom/ArretsLogo";
import DashboardLogo from "./component/atom/DashboardLogo";
import EtablissementLogo from "./component/atom/EtablissementLogo";
import GraphicageLogo from "./component/atom/GraphicageLogo";
import SettingsLogo from "./component/atom/SettingsLogo";
import SupportLogo from "./component/atom/SupportLogo";
import VoirieLogo from "./component/atom/VoirieLogo";
import { changeBoard, onBoard } from "./component/organism/ContextManager";
const [, { setSelectedMenu, getSelectedMenu }] = useStateGui();

export const [isOnPage, setIsOnPage] = createSignal<boolean>(true);
const boardCall = () => {
  if (getSelectedMenu() == "dashboard") {
    setSelectedMenu("graphicage");
  }
};

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
    onClick: () => {
      setIsOnPage(true);
      setSelectedMenu("dashboard");
    },
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
    onClick: () => {
      if (onBoard() == "schools" || onBoard() == "stops") {
        changeBoard("selected-informations");
      }
      setIsOnPage(true);
      setSelectedMenu("graphicage");
    },
  },
  {
    menuItem: "schools",
    Logo: EtablissementLogo,
    label: "Établissements",
    isDisabled: false,
    onClick: () => {
      boardCall();
      setIsOnPage(false);
      changeBoard("schools");
    },
  },
  {
    menuItem: "stops",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
    onClick: () => {
      boardCall();
      setIsOnPage(false);
      changeBoard("stops");
    },
  },
  {
    menuItem: "voirie",
    Logo: VoirieLogo,
    label: "Voirie",
    isDisabled: true,
    onClick: () => {},
  },
  {
    menuItem: "parametres",
    Logo: SettingsLogo,
    label: "Paramètres",
    isDisabled: true,
    onClick: () => {},
  },
  {
    menuItem: "support",
    Logo: SupportLogo,
    label: "Support",
    isDisabled: true,
    onClick: () => {},
  },
];

export default menuItems;
