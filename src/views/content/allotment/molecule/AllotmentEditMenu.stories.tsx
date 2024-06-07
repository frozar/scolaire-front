import { Meta, StoryObj } from "storybook-solidjs";

import AllotmentEditMenuComponent from "./AllotmentEditMenu";

const meta = {
  component: AllotmentEditMenuComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof AllotmentEditMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultAllotment = {
  id: 1,
  name: "Allotissement",
  color: "#ffffff",
  vehicleCost: [],
  transporters: [],
};

const allotmentWithCostAndTransporter = {
  id: 1,
  name: "Allotissement",
  color: "#000000",
  vehicleCost: [{ busCategoryId: 0, cost: 1.57, costHlp: 4.76 }],
  transporters: [
    {
      id: 1,
      name: "transporter",
      type: "Titulaire",
      allotmentId: 2,
      vehicles: [],
      costs: [],
    },
  ],
};

export const NewAllotmentEditContent: Story = {
  args: {
    allotment: defaultAllotment,
    allotmentSetter: undefined,
    toggleEdit: () => {},
  },
};

export const AllotmentEditContentWithContent: Story = {
  args: {
    allotment: allotmentWithCostAndTransporter,
    allotmentSetter: undefined,
    toggleEdit: () => {},
  },
};
