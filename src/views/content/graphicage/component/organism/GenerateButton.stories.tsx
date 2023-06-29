import { Meta, StoryObj } from "storybook-solidjs";

import GenerateButtonComponent from "./GenerateButton";

const meta = {
  component: GenerateButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof GenerateButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function fakeHandleClick() {
  console.log("fakeGenerateButtonHandleClick");
  return;
}

export const GenerateButton: Story = {
  args: {
    handleClick: fakeHandleClick,
    xOffset: "right",
  },
};
