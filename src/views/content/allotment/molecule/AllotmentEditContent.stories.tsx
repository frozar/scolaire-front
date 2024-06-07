import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";
import AllotmentEditContentComponent from "./AllotmentEditContent";

const meta = {
  component: AllotmentEditContentComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof AllotmentEditContentComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function newTransporter(edited: boolean) {
  const [content, setContent] = createSignal<TransporterType>({
    id: 0,
    name: "Transporteur",
    type: "Titulaire",
    allotmentId: 1,
    vehicles: [],
    costs: [],
  });

  const [inEdit, setInEdit] = createSignal(edited);
  const newTransporter = {
    content,
    setContent,
    inEdit,
    setInEdit,
  };
  return newTransporter;
}

export const AllotmentEditContent: Story = {
  args: {
    color: "#ffffff",
    name: "Allotissement",
    transporters: [],
    costs: [],
    costSetter: undefined,
    allotmentSetter: undefined,
    addCb: () => {},
    deleteCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
    updateCb: () => {},
    confirmCb: () => {},
  },
};

export const AllotmentEditContentWithContent: Story = {
  args: {
    color: "#ffffff",
    name: "Allotissement",
    transporters: [newTransporter(false)],
    costs: [{ busCategoryId: 0, cost: 1.57, costHlp: 4.76 }],
    costSetter: undefined,
    allotmentSetter: undefined,
    addCb: () => {},
    deleteCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
    updateCb: () => {},
    confirmCb: () => {},
  },
};
