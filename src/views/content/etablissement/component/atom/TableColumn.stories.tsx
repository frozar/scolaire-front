import { Meta, StoryObj } from "storybook-solidjs";

import TableBodyColumnComponent from "./TableColumn";

const meta = {
  component: TableBodyColumnComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableBodyColumnComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkbox = document.createElement("input");
checkbox.setAttribute("type", "checkbox");

export const TableBodyColumnText: Story = {
  args: {
    children: "column",
  },
};

export const TableBodyColumnCheckBox: Story = {
  args: {
    children: checkbox,
    classVariant: "table-col-checkbox",
  },
};
