import type { Meta, StoryObj } from "storybook-solidjs";
import ActionSelectorComponent from "./ActionSelector";

const meta = {
  component: ActionSelectorComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ActionSelectorComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActionSelector: Story = {
  args: {
    isDisabled: false,
  },
};
