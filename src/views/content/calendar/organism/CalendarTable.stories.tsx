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
        id: 11,
        name: "Mon calendrier",
        rules: ["monday", "tuesday", "thursday", "friday"],
        added: [
          1696104000000, 1696190400000, 1696276800000, 1696363200000,
          1696449600000, 1696536000000, 1696622400000, 1696708800000,
          1696795200000, 1696881600000, 1698782400000, 1698868800000,
          1698955200000, 1699041600000, 1699128000000, 1699214400000,
          1699300800000, 1699387200000, 1699473600000, 1699560000000,
        ],
        deleted: [1696276800000, 1696363200000, 1696536000000],
      },
    ],
  },
};
