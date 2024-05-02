import { useStateGui } from "../../StateGui";
import ArretsLogo from "../../icons/ArretsLogo";
import CalendarIcon from "../../icons/CalendarIcon";
import DashboardLogo from "../../icons/DashboardLogo";
import EtablissementLogo from "../../icons/EtablissementLogo";
import GraphicageLogo from "../../icons/GraphicageLogo";
import { MarketIcon } from "../../icons/MarketIcon";
import RoadwaysLogo from "../../icons/RoadwaysLogo";
import ServiceIcon from "../../icons/ServiceIcon";
import { MenuItemType } from "../../type";
import { ViewManager } from "../content/ViewManager";
import SettingsIcon from "../content/board/component/atom/SettingsIcon";
import { changeBoard } from "../content/board/component/template/ContextManager";

export const [, { setSelectedMenu }] = useStateGui();

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
    onClick: () => {
      ViewManager.dashboard();
    },
  },
  {
    menuItem: "schools",
    Logo: EtablissementLogo,
    label: "Établissements",
    isDisabled: false,
    onClick: () => {
      ViewManager.schools();
    },
  },
  {
    menuItem: "stops",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
    onClick: () => {
      ViewManager.stops();
    },
  },
  {
    menuItem: "paths",
    Logo: RoadwaysLogo,
    label: "Chemins",
    isDisabled: false,
    onClick: () => {
      ViewManager.paths();
    },
  },
  {
    menuItem: "calendar",
    Logo: CalendarIcon,
    label: "Calendrier",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("calendar");
      changeBoard(undefined);
    },
  },
  {
    menuItem: "market",
    Logo: MarketIcon,
    label: "Marché",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("market");
    },
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
    onClick: () => {
      ViewManager.lines();
    },
  },
  {
    menuItem: "service",
    Logo: ServiceIcon,
    label: "Services",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("service");
      changeBoard(undefined);
    },
  },
  {
    menuItem: "parametres",
    Logo: SettingsIcon,
    label: "Paramètres",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("parametres");
      changeBoard(undefined);
    },
  },

  //TODO mutualiser the "RoadWays" view (ponderation) with the path view
  // {
  //   menuItem: "roadways",
  //   Logo: RoadwaysLogo,
  //   label: "Roadways",
  //   isDisabled: false,
  //   onClick: () => {
  //     setSelectedMenu("roadways");
  //     changeBoard(undefined);
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

export const adminItems: MenuItemType[] = [];

export default menuItems;
