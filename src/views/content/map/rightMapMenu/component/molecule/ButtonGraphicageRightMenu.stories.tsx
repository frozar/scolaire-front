import type { Meta, StoryObj } from "storybook-solidjs";

import ButtonGraphicageRightMenu from "./ButtonGraphicageRightMenu";

import { BsInfoCircle } from "solid-icons/bs";
import { CgExport } from "solid-icons/cg";
import {
  FaRegularTrashCan,
  FaSolidGears,
  FaSolidMinus,
  FaSolidPlus,
} from "solid-icons/fa";

const meta = {
  component: ButtonGraphicageRightMenu,
  tags: ["autodocs"],
  args: {
    xOffset: "right",
    isActive: false,
    onClick: () => console.log("onClick on ButtonGraphicageRightMenu"),
  },
} satisfies Meta<typeof ButtonGraphicageRightMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddTrip: Story = {
  args: {
    tooltip: "Ajouter une trip",
    icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
  },
};

export const RemoveTrip: Story = {
  args: {
    tooltip: "Supprimer une trip",
    icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
  },
};

export const ClearMap: Story = {
  args: {
    tooltip: "Vider la carte",
    icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
  },
};

export const ExportMap: Story = {
  args: {
    tooltip: "Exporter",
    icon: <CgExport class="w-full p-0 h-2/3" />,
  },
};

export const GenerateMap: Story = {
  args: {
    tooltip: "Générer des trajets",
    icon: <FaSolidGears class="w-full p-0 h-2/3" />,
  },
};

export const InformationMap: Story = {
  args: {
    tooltip: "Afficher le panneau d'information",
    icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
  },
};
