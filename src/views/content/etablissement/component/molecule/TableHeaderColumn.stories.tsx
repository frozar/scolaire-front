import { Meta, StoryObj } from "storybook-solidjs";

import TableHeaderColumnComponent from "./TableHeaderColumn";

const meta = {
  component: TableHeaderColumnComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableHeaderColumnComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableHeaderColumn: Story = {
  args: {
    children: () => <>Custom Label</>,
  },
};
