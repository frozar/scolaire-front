import { Meta, StoryObj } from "storybook-solidjs";
import { DrawHelperButton } from "./DrawHelperButton";

// TODO todo

const meta = {
  component: DrawHelperButton,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DrawHelperButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DrawHelperButtonStory: Story = {
  args: {
    disabled: false,
  },
};
