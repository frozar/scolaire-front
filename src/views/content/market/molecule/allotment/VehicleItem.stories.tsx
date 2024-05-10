import { Meta, StoryObj } from "storybook-solidjs";

import VehicleItemComponent from "./VehicleItem";

const meta = {
  component: VehicleItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof VehicleItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VehicleItemBusCategoryIdUndefined: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    editCb: () => {},
    deleteCb: () => {},
    vehicleName: "",
  },
};

export const VehicleItemWithBusCategoryId: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    busCategoryId: 0,
    editCb: () => {},
    deleteCb: () => {},
    vehicleName: "",
  },
};

export const VehicleItemWithEdit: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    busCategoryId: 0,
    editCb: () => {
      console.log("in editCb");
    },
    deleteCb: () => {
      console.log("in deleteCb");
    },
    vehicleName: "",
  },
};

export const VehicleItemWithBus: Story = {
  args: {
    licensePlate: "Ma plaque d'immatriculation",
    busCategoryId: 12,
    editCb: () => {
      console.log("in editCb");
    },
    deleteCb: () => {
      console.log("in deleteCb");
    },
    vehicleName: "Nom de bus",
  },
};
