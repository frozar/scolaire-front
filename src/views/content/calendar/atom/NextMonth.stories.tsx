import { Meta, StoryObj } from "storybook-solidjs";
import { NextMonth } from "./NextMonth";

const meta = {
  component: NextMonth,
  tags: ["autodocs"],
} satisfies Meta<typeof NextMonth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NextButton: Story = {
  render: (props: { month: Date }) => {
    return <NextMonth {...props} />;
  },

  args: {
    month: new Date(),
  },
};
