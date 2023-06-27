import type { Meta, StoryObj } from "storybook-solidjs";
import TooltipComponent from "./Tooltip";

const meta = {
  component: TooltipComponent,
  tags: ["autodocs"],
  // argTypes: {
  //   onClick: { action: "clicked action" },
  // },
} satisfies Meta<typeof TooltipComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tooltip: Story = {
  args: {
    tooltip: "Un Tooltip D'Exemple",
    // icon: <FaSolidPlus class="w-full p-0 h-2/3" />,
    // isActive: false,
  },
  // argTypes: {
  //   onClick: { action: "Ajout de ligne" },
  // },
};

// export const RemoveLine: Story = {
//   args: {
//     tooltip: "Supprimer une ligne",
//     icon: <FaSolidMinus class="w-full p-0 h-2/3" />,
//     isActive: false,
//   },
//   argTypes: {
//     onClick: { action: "Suppression de ligne" },
//   },
// };

// export const ClearMap: Story = {
//   args: {
//     tooltip: "Vider la carte",
//     icon: <FaRegularTrashCan class="w-full p-0 h-2/3" />,
//     isActive: false,
//   },
//   argTypes: {
//     onClick: { action: "Vider la carte" },
//   },
// };

// export const ExportMap: Story = {
//   args: {
//     tooltip: "Exporter la carte",
//     icon: <CgExport class="w-full p-0 h-2/3" />,
//     isActive: false,
//   },
//   argTypes: {
//     onClick: { action: "Exporter la carte" },
//   },
// };

// export const GenerateMap: Story = {
//   args: {
//     tooltip: "Génération de lignes",
//     icon: <FiArrowUpCircle class="w-full p-0 h-2/3" />,
//     isActive: false,
//   },
//   argTypes: {
//     onClick: { action: "Génération de ligne" },
//   },
// };

// export const InformationMap: Story = {
//   args: {
//     tooltip: "Ouvrir de panneau d'information",
//     icon: <BsInfoCircle class="w-full p-0 h-2/3" />,
//     isActive: false,
//   },
//   argTypes: {
//     onClick: { action: "Ouverture panneau d'information" },
//   },
// };
