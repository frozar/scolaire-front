import { Meta, StoryObj } from "storybook-solidjs";

import TransporterItemComponent from "./TransporterItem";

const meta = {
  component: TransporterItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TransporterItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TransporterItem: Story = {
  args: {
    enableEditCb: () => {},
    deleteCb: () => {},
    name: "Transporteur",
    type: "Titulaire",
    vehicleLenght: 0,
    costLenght: 0,
  },
};

export const TransporterItemWithVehicleAndCost: Story = {
  args: {
    enableEditCb: () => {},
    deleteCb: () => {},
    name: "Transporteur",
    type: "Titulaire",
    vehicleLenght: 3,
    costLenght: 2,
  },
};

export const TransporterItemWithEditAndDelete: Story = {
  args: {
    enableEditCb: () => console.log("edit Function"),
    deleteCb: () => console.log("delete Function"),
    name: "Transporteur",
    type: "Titulaire",
    vehicleLenght: 3,
    costLenght: 2,
  },
};
