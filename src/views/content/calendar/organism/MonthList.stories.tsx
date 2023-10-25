import { Meta, StoryObj } from "storybook-solidjs";
import MonthListComponent from "./MonthList";

const meta = {
  component: MonthListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MonthListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthList: Story = {
  render: (props: { month: Date }) => {
    return <MonthListComponent {...props} />;
  },

  args: {
    month: new Date(),
  },
};
