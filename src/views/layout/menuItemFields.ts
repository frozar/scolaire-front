import { useStateGui } from "../../StateGui";
import ArretsLogo from "../../icons/ArretsLogo";
import DashboardLogo from "../../icons/DashboardLogo";
import EtablissementLogo from "../../icons/EtablissementLogo";
import GraphicageLogo from "../../icons/GraphicageLogo";
import SettingsLogo from "../../icons/SettingsLogo";
import SupportLogo from "../../icons/SupportLogo";
import VoirieLogo from "../../icons/VoirieLogo";
import { MenuItemType } from "../../type";
import {
  changeBoard,
  onBoard,
} from "../content/board/component/template/ContextManager";

const [, { setSelectedMenu }] = useStateGui();

// export const [isOnPage, setIsOnPage] = createSignal<boolean>(true);
// const boardCall = () => {
//   if (getSelectedMenu() == "dashboard") {
//     setSelectedMenu("graphicage");
//   }
// };

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
    onClick: () => {
      // setIsOnPage(true);
      setSelectedMenu("dashboard");
    },
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
    onClick: () => {
      // if (onBoard() == "schools" || onBoard() == "stops") {
      //   changeBoard("line");
      // }
      // setIsOnPage(true);
      // setSelectedMenu("graphicage");
      if (onBoard() != "line-draw") {
        // ! changer condition ?
        changeBoard("line");
        // setIsOnPage(true);
        setSelectedMenu("graphicage");
      }
    },
  },
  {
    menuItem: "schools",
    Logo: EtablissementLogo,
    label: "Établissements",
    isDisabled: false,
    onClick: () => {
      // boardCall();
      // setIsOnPage(false);
      changeBoard("schools");
      // ! fait bug pq ?
      // setSelectedMenu("schools");
    },
  },
  {
    menuItem: "stops",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
    onClick: () => {
      // boardCall();
      // setIsOnPage(false);
      changeBoard("stops");
    },
  },
  {
    menuItem: "voirie",
    Logo: VoirieLogo,
    label: "Voirie",
    isDisabled: true,
    onClick: () => {
      console.log("Voirie");
    },
  },
  {
    menuItem: "parametres",
    Logo: SettingsLogo,
    label: "Paramètres",
    isDisabled: true,
    onClick: () => {
      console.log("Paramètres");
    },
  },
  {
    menuItem: "support",
    Logo: SupportLogo,
    label: "Support",
    isDisabled: true,
    onClick: () => {
      console.log("Support");
    },
  },
];

export default menuItems;
