import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import Checkbox from "../atom/Checkbox";
import TableCell from "./TableCell";

const meta = {
  component: TableCell,
  tags: ["autodocs"],
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cell: Story = {
  args: {
    children: () => <>Table Cell</>,
  },
};

const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
  document.createElement("input")
);

export const CheckBoxCell: Story = {
  args: {
    children: () => (
      <Checkbox
        ref={setRefCheckbox}
        ariaDescribedby="table-cell"
        name="table-cell"
        onChange={() =>
          console.log("TableCell is checked", refCheckbox().checked)
        }
      />
    ),
  },
};
