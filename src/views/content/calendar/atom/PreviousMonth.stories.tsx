import { Meta, StoryObj } from "storybook-solidjs";
import { PreviousMonth } from "./PreviousMonth";

const meta = {
  component: PreviousMonth,
  tags: ["autodocs"],
} satisfies Meta<typeof PreviousMonth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: { month: Date }) => {
    return <PreviousMonth {...props} />;
  },

  args: {
    month: new Date(),
  },
};
