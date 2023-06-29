import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import RemoveLineButtonComponent from "./RemoveLineButton";

const meta = {
  component: RemoveLineButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof RemoveLineButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeIsInRemoveLineMode, setFakeIsInRemoveLineMode] = createSignal(false);

function fakeHandleClick() {
  console.log("fakeRemoveLineHandleClick");

  setFakeIsInRemoveLineMode((bool) => !bool);
}

export const RemoveLineButton: Story = {
  args: {
    handleClick: fakeHandleClick,
    isInRemoveLineMode: fakeIsInRemoveLineMode,
    xOffset: "right",
  },
};
