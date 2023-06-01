import type { Meta, StoryObj } from "storybook-solidjs";
import ButtonGraphicageRightMenu from "./ButtonGraphicageRightMenu";
import { FaRegularTrashCan, FaSolidMinus, FaSolidPlus } from "solid-icons/fa";
import { CgExport } from "solid-icons/cg";
import { FiArrowUpCircle } from "solid-icons/fi";
import { BsInfoCircle } from "solid-icons/bs";

const meta = {
  title: "Graphicage/RightMenu/ButtonGraphicageRightMenu",
  component: ButtonGraphicageRightMenu,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked action" },
  },
} satisfies Meta<typeof ButtonGraphicageRightMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const addLineDisable: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const addLineEnable: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};

export const RemoveLineDisable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const RemoveLineEnable: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};

export const ClearMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const ClearMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};

export const ExportMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <CgExport class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const ExportMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <CgExport class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};

export const GenerateMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const GenerateMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};

export const InformationMapDisable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
    isActive: false,
  },
};

export const InformationMapEnable: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
    isActive: true,
  },
};
