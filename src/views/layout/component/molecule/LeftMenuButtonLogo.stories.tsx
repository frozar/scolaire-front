import { Meta, StoryObj } from "storybook-solidjs";

import ArretsLogo from "../../../../icons/ArretsLogo";

import DashboardLogo from "../../../../icons/DashboardLogo";
import EtablissementLogo from "../../../../icons/EtablissementLogo";
import GraphicageLogo from "../../../../icons/GraphicageLogo";
import RoadwaysLogo from "../../../../icons/RoadwaysLogo";
import SettingsLogo from "../../../../icons/SettingsLogo";
import SupportLogo from "../../../../icons/SupportLogo";
import LeftMenuButtonLogoComponent from "./LeftMenuButtonLogo";

const logos = {
  DashboardLogo,
  GraphicageLogo,
  RoadwaysLogo,
  EtablissementLogo,
  ArretsLogo,
  SettingsLogo,
  SupportLogo,
};

const meta = {
  component: LeftMenuButtonLogoComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftMenuButtonLogoComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftMenuButtonLogo: Story = {
  args: {
    isActive: false,
  },
  argTypes: {
    children: {
      options: Object.keys(logos),
      mapping: logos,
      control: {
        type: "select",
        labels: {
          DashboardLogo: "dashboard",
          GraphicageLogo: "graphicage",
          RoadwaysLogo: "roadways",
          EtablissementLogo: "etablissement",
          ArretsLogo: "stop",
          SettingsLogo: "parametres",
          SupportLogo: "support",
        },
      },
    },
  },
};
