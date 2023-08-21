import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import Checkbox from "../atom/Checkbox";
import TableHeaderCellComponent from "./TableHeaderCell";

const meta = {
  component: TableHeaderCellComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableHeaderCellComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableHeaderCell: Story = {
  args: {
    children: () => <>Custom Label</>,
  },
};

const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
  document.createElement("input")
);

export const TableHeaderCellCheckbox: Story = {
  args: {
    children: () => (
      <Checkbox
        ref={setRefCheckbox}
        name="table-header-cell"
        ariaDescribedby="table-header-cell"
        onChange={() => {
          console.log(
            "Table header cell checkbox is checked: ",
            refCheckbox().checked
          );
        }}
      />
    ),
  },
};
