import { createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";
import DrawHelperDialogItem from "./DrawHelperDialogItem";

// TODO todo

const meta = {
  component: DrawHelperDialogItem,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof DrawHelperDialogItem>;

export default meta;
type Story = StoryObj<typeof meta>;
const [value, setValue] = createSignal(1);
export const DrawHelperDialogStory: Story = {
  args: {
    value: value,
    setValue: setValue,
    text: "test",
    disabled: false,
  },
};
