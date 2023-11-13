import { Meta, StoryObj } from "storybook-solidjs";
import { PublicHolidayType } from "../../../../_entities/calendar.entity";
import { PublicHolidayItem as PublicHolidayItemComponent } from "./PublicHolidayItem";
const meta = {
  component: PublicHolidayItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PublicHolidayItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublicHolidayInAppendMode: Story = {
  render: (props: { item?: PublicHolidayType }) => {
    return <PublicHolidayItemComponent {...props} />;
  },

  args: {},
};

export const PublicHolidayWithData: Story = {
  render: (props: { item?: PublicHolidayType }) => {
    return <PublicHolidayItemComponent {...props} />;
  },

  args: {
    item: {
      name: "noël",
      date: new Date("2023-12-20"),
    },
  },
};
