import { Meta, StoryObj } from "storybook-solidjs";
import DayItemComponent from "./DayItem";

const meta = {
  component: DayItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof DayItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayItem: Story = {
  render: (props: { day: number }) => {
    return <DayItemComponent {...props} />;
  },

  args: {
    day: 1,
  },
};
