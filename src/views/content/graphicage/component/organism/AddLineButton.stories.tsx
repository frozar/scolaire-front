import { createSignal } from "solid-js";

import { Meta, StoryObj } from "storybook-solidjs";

import AddLineButtonComponent from "./AddLineButton";

const meta = {
  component: AddLineButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof AddLineButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeIsInAddLineMode, setFakeIsInAddLineMode] = createSignal(false);

export const AddLineButton: Story = {
  args: {
    handleClick: () => {
      console.log("onClick on AddLineButton");
      return setFakeIsInAddLineMode((bool) => !bool);
    },
    isInAddLineMode: fakeIsInAddLineMode,
    xOffset: "right",
  },
};
