import { Meta, StoryObj } from "storybook-solidjs";

import ClearButtonComponent from "./ClearButton";

const meta = {
  component: ClearButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ClearButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function fakeHandleClick() {
  console.log("fakeClearButtonHandleClick");
  return;
}

export const ClearButton: Story = {
  args: {
    handleClick: fakeHandleClick,
    xOffset: "right",
  },
};
