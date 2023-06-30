import { Meta, StoryObj } from "storybook-solidjs";

import GenerateButtonComponent from "./GenerateButton";

const meta = {
  component: GenerateButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof GenerateButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GenerateButton: Story = {
  args: {
    handleClick: () => console.log("onClick on GenerateButton"),
    xOffset: "right",
  },
};
