import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../template/Calendar";
import CalendarContentComponent from "./CalendarContent";
const meta = {
  component: CalendarContentComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarContentComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarContent: Story = {
  render: (props: { month: Date; calendars: CalendarType[] }) => {
    return <CalendarContentComponent {...props} />;
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
