import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarAddLine as CalendarAddLineComponent } from "./CalendarAddLine";

const meta = {
  component: CalendarAddLineComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarAddLineComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarAddLine: Story = {
  render: (props: { month: Date }) => {
    return <CalendarAddLineComponent {...props} />;
  },

  args: {
    month: new Date(),
  },
};
