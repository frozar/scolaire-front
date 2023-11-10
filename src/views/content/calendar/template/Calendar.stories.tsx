import { Meta, StoryObj } from "storybook-solidjs";

import { Calendar as CalendarLayout } from "./Calendar";

const meta = {
  component: CalendarLayout,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Calendar: Story = {
  render: () => {
    return <CalendarLayout />;
  },
};
