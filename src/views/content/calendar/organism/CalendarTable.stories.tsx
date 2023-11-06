import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarTable as CalendarTableComponent } from "./CalendarTable";

const meta = {
  component: CalendarTableComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarTableComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarTable: Story = {
  render: (props: { currentMonth: Date; calendars: CalendarType[] }) => {
    return <CalendarTableComponent {...props} />;
  },

  args: {
    currentMonth: new Date(),
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
