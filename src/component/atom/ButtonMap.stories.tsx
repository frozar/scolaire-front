import type { Meta, StoryObj } from "storybook-solidjs";
import ButtonMap from "./ButtonMap";
import {
  AddLineIcon,
  ClearMapIcon,
  ExportIcon,
  GenerateIcon,
  InformationIcon,
  RemoveLineIcon,
} from "./ButtonMapIcons";

const meta = {
  title: "Map/RightMenu/Button",
  component: ButtonMap,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked action" },
  },
} satisfies Meta<typeof ButtonMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const addLineDisable: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <AddLineIcon />,
    _class: false,
  },
};

export const addLineEnable: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <AddLineIcon />,
    _class: true,
  },
};

export const RemoveLineDisable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <RemoveLineIcon />,
    _class: false,
  },
};

export const RemoveLineEnable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <RemoveLineIcon />,
    _class: true,
  },
};

export const ClearMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <ClearMapIcon />,
    _class: false,
  },
};

export const ClearMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <ClearMapIcon />,
    _class: true,
  },
};

export const ExportMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <ExportIcon />,
    _class: false,
  },
};

export const ExportMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <ExportIcon />,
    _class: true,
  },
};

export const GenerateMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <GenerateIcon />,
    _class: false,
  },
};

export const GenerateMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <GenerateIcon />,
    _class: true,
  },
};

export const InformationMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <InformationIcon />,
    _class: false,
  },
};

export const InformationMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <InformationIcon />,
    _class: true,
  },
};
