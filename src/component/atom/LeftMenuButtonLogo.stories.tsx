import { Meta, StoryObj } from "storybook-solidjs";

import DashboardLogo from "../../views/layout/leftMenu/logo/DashboardLogo";
import GraphicageLogo from "../../views/layout/leftMenu/logo/GraphicageLogo";
import VoirieLogo from "../../views/layout/leftMenu/logo/VoirieLogo";
import EtablissementLogo from "../../views/layout/leftMenu/logo/EtablissementLogo";
import ArretsLogo from "../../views/layout/leftMenu/logo/ArretsLogo";
import SettingsLogo from "../../views/layout/leftMenu/logo/SettingsLogo";
import SupportLogo from "../../views/layout/leftMenu/logo/SupportLogo";

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
