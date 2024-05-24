import { Meta, StoryObj } from "storybook-solidjs";
import { CostItem } from "./CostItem";

const meta = {
  component: CostItem,
  tags: ["autodocs"],
} satisfies Meta<typeof CostItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const costItem: Story = {
  args: {
    enableEditCb: () => {},
    deleteCb: () => {},
    vehicleName: "Nom Vehicule",
    busCategoryId: 0,
    cost: 11,
    costHlp: 22,
  },
};

export const costItemWithEditAndDelete: Story = {
  args: {
    enableEditCb: () => console.log("enable Edit Callback"),
    deleteCb: () => console.log("delete Callback"),
    vehicleName: "Nom Vehicule",
    busCategoryId: 0,
    cost: 11,
    costHlp: 22,
  },
};
