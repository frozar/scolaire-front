import type { Meta, StoryObj } from "storybook-solidjs";
import ButtonCloseProps from "./CloseButton";

const meta = {
  title: "Global/Button",
  component: ButtonCloseProps,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked action" },
  },
} satisfies Meta<typeof ButtonCloseProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CloseButton: Story = {
  argTypes: {
    onClick: { action: "Close window" },
  },
};
