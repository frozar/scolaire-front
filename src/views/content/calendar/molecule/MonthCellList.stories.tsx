import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../template/Calendar";
import { MonthCellList as MonthCellListComponent } from "./MonthCellList";

const meta = {
  component: MonthCellListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MonthCellListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthCellList: Story = {
  render: (props: { month: Date; calendar: CalendarType }) => {
    return <MonthCellListComponent {...props} />;
  },

  args: {
    month: new Date(),
    calendar: {
      calendarName: "Calendrier Maternel",
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: ["01-01-2023"],
      dated_deleted: ["02-01-2023"],
    },
  },
};
