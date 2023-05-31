import type { Meta, StoryObj } from "storybook-solidjs";

import ButtonMap from "./ButtonMap";

const meta = {
  title: "Example/Button",
  component: ButtonMap,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked tt" },
  },
} satisfies Meta<typeof ButtonMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};
