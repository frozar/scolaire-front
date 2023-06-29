import type { Meta, StoryObj } from "storybook-solidjs";

import ButtonGraphicageRightMenu from "./ButtonGraphicageRightMenu";

import { BsInfoCircle } from "solid-icons/bs";
import { CgExport } from "solid-icons/cg";
import { FaRegularTrashCan, FaSolidMinus, FaSolidPlus } from "solid-icons/fa";
import { FiArrowUpCircle } from "solid-icons/fi";

const meta = {
  component: ButtonGraphicageRightMenu,
  tags: ["autodocs"],
  args: {
    xOffset: "right",
  },
  argTypes: {
    onClick: { action: "clicked action" },
  },
} satisfies Meta<typeof ButtonGraphicageRightMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddLine: Story = {
  args: {
    tooltip: "Ajouter une ligne",
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Ajout de ligne" },
  },
};

export const RemoveLine: Story = {
  args: {
    tooltip: "Supprimer une ligne",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Suppression de ligne" },
  },
};

export const ClearMap: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Vider la carte" },
  },
};

export const ExportMap: Story = {
  args: {
    tooltip: "Exporter la carte",
    icon: <CgExport class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Exporter la carte" },
  },
};

export const GenerateMap: Story = {
  args: {
    tooltip: "Génération de lignes",
    icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Génération de ligne" },
  },
};

export const InformationMap: Story = {
  args: {
    tooltip: "Ouvrir de panneau d'information",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
    isActive: false,
  },
  argTypes: {
    onClick: { action: "Ouverture panneau d'information" },
  },
};
