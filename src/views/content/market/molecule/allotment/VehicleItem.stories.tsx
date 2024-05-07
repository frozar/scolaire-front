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
    item: {
      license: "Ma plaque d'immatriculation",
    },
    editCb: () => {},
    deleteCb: () => {},
  },
};

export const VehicleItemWithBusCategoryId: Story = {
  args: {
    item: {
      license: "Ma plaque d'immatriculation",
      busCategoryId: 0,
    },
    editCb: () => {},
    deleteCb: () => {},
  },
};

export const VehicleItemWithEdit: Story = {
  args: {
    item: {
      license: "Ma plaque d'immatriculation",
      busCategoryId: 0,
    },
    editCb: () => {
      console.log("in editCb");
    },
    deleteCb: () => {
      console.log("in deleteCb");
    },
  },
};
