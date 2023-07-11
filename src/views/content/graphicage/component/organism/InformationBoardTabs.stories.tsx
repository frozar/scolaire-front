import { Meta, StoryObj } from "storybook-solidjs";
import { InformationBoardTabType } from "../../../../../type";
import InformationContent from "../../informationBoard/InformationContent";
import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabs } from "./InformationBoardTabs";

const meta = {
  component: InformationBoardTabs,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabs>;

const tabs: InformationBoardTabType[] = [
  {
    content: InformationContent,
    icon: InformationCircleIcon,
    label: "Informations",
  },
  {
    content: InformationContent,
    icon: SettingsIcon,
    label: "Paramètres",
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardTabsStory: Story = {
  args: {
    tabs: tabs,
  },
};
