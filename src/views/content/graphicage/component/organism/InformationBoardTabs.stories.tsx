import { Meta, StoryObj } from "storybook-solidjs";
// import { InformationBoardTabType } from "../../../../../type";
import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabsItemProps } from "../molecule/InformationBoardTabsItem";
import { InformationBoardTabs } from "./InformationBoardTabs";

const meta = {
  component: InformationBoardTabs,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabs>;

// const tabs: InformationBoardTabType[] = [
const tabs: InformationBoardTabsItemProps[] = [
  {
    // content: InformationContent,
    label: "Informations",
    icon: InformationCircleIcon,
    onClick: () => console.log("On click event."),
  },
  {
    // content: InformationContent,
    label: "Paramètres",
    icon: SettingsIcon,
    onClick: () => console.log("On click event."),
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardTabsStory: Story = {
  args: {
    tabs: tabs,
  },
};
