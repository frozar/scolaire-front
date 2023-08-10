import { Meta, StoryObj } from "storybook-solidjs";
import DrawHelperDialog from "./DrawHelperDialog";

// TODO todo

const meta = {
  component: DrawHelperDialog,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DrawHelperDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DrawHelperDialogStory: Story = {
  args: {
    getter: () => true,
  },
};
