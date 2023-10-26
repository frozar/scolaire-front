import { Meta, StoryObj } from "storybook-solidjs";
import CellItemComponent from "./CellItem";

const meta = {
  component: CellItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CellItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayItem: Story = {
  render: () => {
    return <CellItemComponent />;
  },
};
