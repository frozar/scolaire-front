import { Meta, StoryObj } from "storybook-solidjs";

import ArretsLogo from "../../../../icons/ArretsLogo";
import DashboardLogo from "../atom/DashboardLogo";
import EtablissementLogo from "../atom/EtablissementLogo";
import GraphicageLogo from "../atom/GraphicageLogo";
import SettingsLogo from "../atom/SettingsLogo";
import SupportLogo from "../atom/SupportLogo";
import VoirieLogo from "../atom/VoirieLogo";

import LeftMenuButtonLogoComponent from "./LeftMenuButtonLogo";

const logos = {
  DashboardLogo,
  GraphicageLogo,
  VoirieLogo,
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
          VoirieLogo: "voirie",
          EtablissementLogo: "etablissement",
          ArretsLogo: "stop",
          SettingsLogo: "parametres",
          SupportLogo: "support",
        },
      },
    },
  },
};
