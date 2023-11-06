import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarContent } from "./CalendarContent";
const meta = {
  component: CalendarContent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarContentStory: Story = {
  render: (props: { month: Date; calendars: CalendarType[] }) => {
    return <CalendarContent {...props} />;
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
