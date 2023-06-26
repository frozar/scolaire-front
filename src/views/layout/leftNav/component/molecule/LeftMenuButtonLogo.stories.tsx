import { Meta, StoryObj } from "storybook-solidjs";

import DashboardLogo from "../../../../../component/atom/DashboardLogo";
import GraphicageLogo from "../../../../../component/atom/GraphicageLogo";
import VoirieLogo from "../../../../../component/atom/VoirieLogo";
import EtablissementLogo from "../../../../../component/atom/EtablissementLogo";
import ArretsLogo from "../../../../../component/atom/ArretsLogo";
import SettingsLogo from "../../../../../component/atom/SettingsLogo";
import SupportLogo from "../../../../../component/atom/SupportLogo";

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
  title: "LeftNav/Item/Logo",
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
