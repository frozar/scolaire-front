import { Meta, StoryObj } from "storybook-solidjs";
import { VacationPeriodType } from "../../../../_entities/calendar.entity";
import { VacationItem as VacationItemComponent } from "./VacationItem";
const meta = {
  component: VacationItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof VacationItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VacationItemInAppendMode: Story = {
  render: (props: { item?: VacationPeriodType }) => {
    return <VacationItemComponent {...props} />;
  },

  args: {},
};

export const VacationItemWithData: Story = {
  render: (props: { item?: VacationPeriodType }) => {
    return <VacationItemComponent {...props} />;
  },

  args: {
    item: {
      name: "noël",
      start: new Date("2023-12-20"),
      end: new Date("2023-12-31"),
    },
  },
};
