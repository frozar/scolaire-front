import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../template/Calendar";
import MonthListContentComponent from "./CalendarLineContent";

const meta = {
  component: MonthListContentComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MonthListContentComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthListContent: Story = {
  render: (props: { month: Date; calendar: CalendarType }) => {
    return <MonthListContentComponent {...props} />;
  },

  args: {
    month: new Date(),
    calendar: {
      calendarName: "Calendrier Maternel",
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: ["01-01-2023"],
      date_deleted: ["02-01-2023"],
    },
  },
};
