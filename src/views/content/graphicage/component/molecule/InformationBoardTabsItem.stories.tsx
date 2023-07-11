import { Meta, StoryObj } from "storybook-solidjs";
import InformationCircleIcon from "../atom/InformationCircleIcon";
import SettingsIcon from "../atom/SettingsIcon";
import { InformationBoardTabsItem } from "./InformationBoardTabsItem";

const meta = {
  component: InformationBoardTabsItem,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabsItem>;

const icon = SettingsIcon;

const icons = {
  SettingsIcon,
  InformationCircleIcon,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardTabsItemStory: Story = {
  args: {
    isActive: false,
    icon: icon,
    label: "Paramètres",
  },
  argTypes: {
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: "select",
        labels: {
          SettingsIcon: "Settings",
          InformationCircleIcon: "Informations",
        },
      },
    },
  },
};
