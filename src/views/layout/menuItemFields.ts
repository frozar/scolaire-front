import { useStateGui } from "../../StateGui";
import ArretsLogo from "../../icons/ArretsLogo";
import CalendarIcon from "../../icons/CalendarIcon";
import DashboardLogo from "../../icons/DashboardLogo";
import EtablissementLogo from "../../icons/EtablissementLogo";
import GraphicageLogo from "../../icons/GraphicageLogo";
import { MenuItemType } from "../../type";
import { MapElementUtils } from "../../utils/mapElement.utils";
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
        console.log("in if bis");
        console.log("onBoard before =>", onBoard());

        changeBoard("line");
        console.log("onBoard =>", onBoard());
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
