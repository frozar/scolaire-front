import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { PublicHolidayList as PublicHolidayListComponent } from "./PublicHolidayList";

const meta = {
  component: PublicHolidayListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PublicHolidayListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicHolidayList: Story = {
  render: (props: { calendarPeriod: CalendarPeriodType }) => {
    return <PublicHolidayListComponent {...props} />;
  },

  args: {
    calendarPeriod: {
      id: 1,
      name: "Calendar 1",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      vacationsPeriod: [],
      publicHolidays: [
        {
          name: "noël",
          date: new Date("2023-12-25"),
        },
      ],
    },
  },
};
