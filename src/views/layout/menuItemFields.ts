import { useStateGui } from "../../StateGui";
import ArretsLogo from "../../icons/ArretsLogo";
import CalendarIcon from "../../icons/CalendarIcon";
import DashboardLogo from "../../icons/DashboardLogo";
import EtablissementLogo from "../../icons/EtablissementLogo";
import GraphicageLogo from "../../icons/GraphicageLogo";
import { MarketIcon } from "../../icons/MarketIcon";
import ServiceIcon from "../../icons/ServiceIcon";
import VoirieLogo from "../../icons/VoirieLogo";
import { MenuItemType } from "../../type";
import { MapElementUtils } from "../../utils/mapElement.utils";
import SettingsIcon from "../content/board/component/atom/SettingsIcon";
import {
  changeBoard,
  onBoard,
} from "../content/board/component/template/ContextManager";

export const [, { setSelectedMenu }] = useStateGui();

const menuItems: MenuItemType[] = [
  {
    menuItem: "dashboard",
    Logo: DashboardLogo,
    label: "Dashboard",
    isDisabled: false,
    onClick: () => {
      changeBoard(undefined);
      setSelectedMenu("dashboard");
    },
  },
  {
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    label: "Graphicage",
    isDisabled: false,
    onClick: () => {
      if (onBoard() != "trip-draw") {
        changeBoard("line");
        MapElementUtils.deselectAllPointsAndBusTrips();
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
      MapElementUtils.deselectAllPointsAndBusTrips();
    },
  },
  {
    menuItem: "stops",
    Logo: ArretsLogo,
    label: "Arrêts",
    isDisabled: false,
    onClick: () => {
      changeBoard("stops");
      MapElementUtils.deselectAllPointsAndBusTrips();
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
    menuItem: "service",
    Logo: ServiceIcon,
    label: "Service",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("service");
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
    menuItem: "parametres",
    Logo: SettingsIcon,
    label: "Paramètres",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("parametres");
      changeBoard(undefined);
    },
  },

  {
    menuItem: "voirie",
    Logo: VoirieLogo,
    label: "Voirie",
    isDisabled: false,
    onClick: () => {
      setSelectedMenu("voirie");
      changeBoard(undefined);
      console.log("Voirie");
    },
  },
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
