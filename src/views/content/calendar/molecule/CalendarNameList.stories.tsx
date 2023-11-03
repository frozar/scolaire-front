import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../template/Calendar";
import CalendarNameListComponent from "./CalendarNameList";

const meta = {
  component: CalendarNameListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarNameListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarNameList: Story = {
  render: (props: { calendars: CalendarType[] }) => {
    return <CalendarNameListComponent {...props} />;
  },

  args: {
    month: new Date(),
    calendars: [
      {
        calendarName: "Calendrier Maternel",
        rules: ["monday", "tuesday", "thursday", "friday"],
        date_added: ["01-01-2023"],
        date_deleted: ["02-01-2023"],
      },
      {
        calendarName: "Calendrier Internat Lundi",
        rules: ["monday", "tuesday", "thursday", "friday"],
        date_added: ["01-01-2023"],
        date_deleted: ["02-01-2023"],
      },
    ],
  },
};
