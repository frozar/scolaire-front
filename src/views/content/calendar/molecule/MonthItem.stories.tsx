import { Meta, StoryObj } from "storybook-solidjs";
import MonthItemComponent from "./MonthItem";

const meta = {
  component: MonthItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MonthItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthItem: Story = {
  render: (props: { month: Date }) => {
    return <MonthItemComponent {...props} />;
  },

  args: {
    month: new Date(),
  },
};
