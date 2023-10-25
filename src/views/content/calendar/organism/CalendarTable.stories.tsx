import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarTable as CalendarTableComponent } from "./CalendarTable";

const meta = {
  component: CalendarTableComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarTableComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarTable: Story = {
  render: (props: { currentMonth: Date }) => {
    return <CalendarTableComponent {...props} />;
  },

  args: {
    currentMonth: new Date(),
  },
};
