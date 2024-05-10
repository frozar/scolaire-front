import { Meta, StoryObj } from "storybook-solidjs";

import VehicleItemComponent from "./VehicleItem";

const meta = {
  component: VehicleItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof VehicleItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VehicleItem: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    busCategoryId: 12,
    editCb: () => {},
    deleteCb: () => {},
    vehicleName: "Nom de bus",
  },
};

export const VehicleItemWithEditAndDelete: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    busCategoryId: 0,
    editCb: () => {
      console.log("in editCb");
    },
    deleteCb: () => {
      console.log("in deleteCb");
    },
    vehicleName: "Nom de bus",
  },
};
