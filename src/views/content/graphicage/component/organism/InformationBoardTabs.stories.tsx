import { createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";
import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import {
  InformationBoardTabType,
  InformationBoardTabs,
  informationBoardTabIdType,
} from "./InformationBoardTabs";

const meta = {
  component: InformationBoardTabs,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabs>;

const [getInformationBoardSelectedTab, setInformationBoardSelectedTab] =
  createSignal("information" as informationBoardTabIdType);

function wrapGetInformationBoardSelectedTab() {
  console.log("In getInformationBoardSelectedTab");
  return getInformationBoardSelectedTab();
}

function wrapSetInformationBoardSelectedTab(key: informationBoardTabIdType) {
  console.log("In setInformationBoardSelectedTab");
  return setInformationBoardSelectedTab(key);
}

const tabs: Omit<InformationBoardTabType, "content">[] = [
  {
    id: "information",
    label: "Informations",
    icon: InformationCircleIcon,
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: SettingsIcon,
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardTabsStory: Story = {
  args: {
    tabs: tabs,
    getInformationBoardSelectedTab: wrapGetInformationBoardSelectedTab,
    setInformationBoardSelectedTab: wrapSetInformationBoardSelectedTab,
  },
};
