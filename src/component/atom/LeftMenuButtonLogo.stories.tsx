import { Meta, StoryObj } from "storybook-solidjs";

import DashboardLogo from "./DashboardLogo";
import GraphicageLogo from "./GraphicageLogo";
import VoirieLogo from "./VoirieLogo";
import EtablissementLogo from "./EtablissementLogo";
import ArretsLogo from "./ArretsLogo";
import SettingsLogo from "./SettingsLogo";
import SupportLogo from "./SupportLogo";

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
  title: "LeftNav/ButtonLogo",
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
    logo: {
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
