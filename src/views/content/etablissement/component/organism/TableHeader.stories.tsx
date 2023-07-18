import { Meta, StoryObj } from "storybook-solidjs";

import TableHeaderColumn from "../molecule/TableHeaderCell";
import TableHeaderComponent from "./TableHeader";

const meta = {
  component: TableHeaderComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableHeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableHeader: Story = {
  args: {
    children: () => (
      <>
        <TableHeaderColumn>Column 1</TableHeaderColumn>
        <TableHeaderColumn>Column 2</TableHeaderColumn>
        <TableHeaderColumn>Column 3</TableHeaderColumn>
      </>
    ),
  },
};
