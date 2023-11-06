import { Meta, StoryObj } from "storybook-solidjs";
import DayItem from "./DayItem";

const meta = {
  component: DayItem,
  tags: ["autodocs"],
} satisfies Meta<typeof DayItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DayItemStory: Story = {
  render: (props: { day: Date }) => {
    return <DayItem {...props} />;
  },

  args: {
    day: new Date(),
  },
};
