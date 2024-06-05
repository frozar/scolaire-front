import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import TransporterListComponent from "./TransporterList";

const meta = {
  component: TransporterListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TransporterListComponent>;

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

export const TransporterEmptyList: Story = {
  args: {
    transporters: [],
    addCb: () => {},
    deleteCb: () => {},
    updateCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
  },
};

export const TransporterListWithItem: Story = {
  args: {
    transporters: [newTransporter(false)],
    addCb: () => {},
    deleteCb: () => {},
    updateCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
  },
};

export const TransporterListWithMultipleItems: Story = {
  args: {
    transporters: [
      newTransporter(false),
      newTransporter(false),
      newTransporter(false),
    ],
    addCb: () => {},
    deleteCb: () => {},
    updateCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
  },
};

export const TransporterListWithItemInEdit: Story = {
  args: {
    transporters: [newTransporter(true)],
    addCb: () => {},
    deleteCb: () => {},
    updateCb: () => {},
    enableEditCb: () => {},
    disableEditCb: () => {},
  },
};
