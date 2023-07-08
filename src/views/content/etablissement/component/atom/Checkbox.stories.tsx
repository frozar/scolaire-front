import { Meta, StoryObj } from "storybook-solidjs";

import CheckboxComponent from "./Checkbox";

const meta = {
  component: CheckboxComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
  args: {},
};
