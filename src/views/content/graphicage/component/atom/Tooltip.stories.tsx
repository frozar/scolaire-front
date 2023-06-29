import type { Meta, StoryObj } from "storybook-solidjs";

import TooltipComponent from "./Tooltip";

const meta = {
  component: TooltipComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TooltipComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tooltip: Story = {
  args: {
    tooltip: "Un Tooltip D'Exemple",
  },
};
