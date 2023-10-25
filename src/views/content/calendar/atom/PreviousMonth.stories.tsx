import { Meta, StoryObj } from "storybook-solidjs";
import { PreviousMonth as PreviousMonthComponent } from "./PreviousMonth";

const meta = {
  component: PreviousMonthComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PreviousMonthComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreviousMonthButton: Story = {
  render: (props: { month: Date }) => {
    return <PreviousMonthComponent {...props} />;
  },

  args: {
    month: new Date(),
  },
};
