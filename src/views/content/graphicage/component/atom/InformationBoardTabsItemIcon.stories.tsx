import { Meta, StoryObj } from "storybook-solidjs";
import { InformationBoardTabsItemIcon } from "./InformationBoardTabsItemIcon";
import InformationCircleIcon from "./InformationCircleIcon";
import SettingsIcon from "./SettingsIcon";

const meta = {
  component: InformationBoardTabsItemIcon,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabsItemIcon>;

const icon = SettingsIcon;

const icons = {
  SettingsIcon,
  InformationCircleIcon,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftMenuItemLabel: Story = {
  args: {
    isActive: false,
    icon: icon,
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
