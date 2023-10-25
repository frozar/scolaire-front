import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarHeader as CalendarHeaderComponent } from "./CalendarHeader";

const meta = {
  component: CalendarHeaderComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarHeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarHeader: Story = {
  render: (props: { month: Date }) => {
    return <CalendarHeaderComponent {...props} />;
  },

  args: {
    month: new Date(),
  },
};
