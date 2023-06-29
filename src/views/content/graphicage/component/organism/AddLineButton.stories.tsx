import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import AddLineButtonComponent from "./AddLineButton";

const meta = {
  component: AddLineButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof AddLineButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeIsInAddLineMode, setFakeIsInAddLineMode] = createSignal(false);

function fakeHandleClick() {
  setFakeIsInAddLineMode((bool) => !bool);
}

export const AddLineButton: Story = {
  args: {
    handleClick: fakeHandleClick,
    isInAddLineMode: fakeIsInAddLineMode,
    xOffset: "right",
  },
};
