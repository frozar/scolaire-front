import ArretsLogo from "../../icons/ArretsLogo";
import DashboardLogo from "../../icons/DashboardLogo";
import EtablissementLogo from "../../icons/EtablissementLogo";
import GraphicageLogo from "../../icons/GraphicageLogo";
import { MenuItemType } from "../../type";
import { MapElementUtils } from "../../utils/mapElement.utils";
import {
  changeBoard,
  onBoard,
} from "../content/board/component/template/ContextManager";

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
    onClick: () => {
      changeBoard(undefined);
    },
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
    onClick: () => {
      if (onBoard() != "course-draw") {
        changeBoard("line");
        MapElementUtils.deselectAllPointsAndBusCourses();
      }
    },
  },
  {
    menuItem: "schools",
    Logo: EtablissementLogo,
    label: "Établissements",
    isDisabled: false,
    onClick: () => {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusCourses();
    },
  },
  {
    menuItem: "stops",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
    onClick: () => {
      changeBoard("stops");
      MapElementUtils.deselectAllPointsAndBusCourses();
    },
  },
  // {
  //   menuItem: "voirie",
  //   Logo: VoirieLogo,
  //   label: "Voirie",
  //   isDisabled: true,
  //   onClick: () => {
  //     console.log("Voirie");
  //   },
  // },
  // {
  //   menuItem: "parametres",
  //   Logo: SettingsLogo,
  //   label: "Paramètres",
  //   isDisabled: true,
  //   onClick: () => {
  //     console.log("Paramètres");
  //   },
  // },
  // {
  //   menuItem: "support",
  //   Logo: SupportLogo,
  //   label: "Support",
  //   isDisabled: true,
  //   onClick: () => {
  //     console.log("Support");
  //   },
  // },
];

export default menuItems;
