import type { Meta, StoryObj } from "storybook-solidjs";
import ButtonMap from "./ButtonMap";
import { FaRegularTrashCan, FaSolidMinus, FaSolidPlus } from "solid-icons/fa";
import { CgExport } from "solid-icons/cg";
import { FiArrowUpCircle } from "solid-icons/fi";
import { BsInfoCircle } from "solid-icons/bs";

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
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const addLineEnable: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    _class: true,
  },
};

export const RemoveLineDisable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const RemoveLineEnable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
    _class: true,
  },
};

export const ClearMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const ClearMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
    _class: true,
  },
};

export const ExportMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <CgExport class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const ExportMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <CgExport class="w-full p-0 h-2/3" />,
    _class: true,
  },
};

export const GenerateMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const GenerateMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
    _class: true,
  },
};

export const InformationMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
    _class: false,
  },
};

export const InformationMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
    _class: true,
  },
};
