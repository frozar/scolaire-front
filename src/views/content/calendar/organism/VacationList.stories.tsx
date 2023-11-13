import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { VacationList as VacationListComponent } from "./VacationList";
const meta = {
  component: VacationListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof VacationListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VacationList: Story = {
  render: (props: { calendarPeriod: CalendarPeriodType }) => {
    return <VacationListComponent {...props} />;
  },

  args: {
    calendarPeriod: {
      id: 1,
      name: "Calendar 1",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      vacationsPeriod: [
        {
          name: "noël",
          start: new Date("2023-12-20"),
          end: new Date("2023-12-30"),
        },
      ],

      publicHolidays: [],
    },
  },
};
