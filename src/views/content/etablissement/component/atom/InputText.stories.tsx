import { Meta, StoryObj } from "storybook-solidjs";

import InputTextComponent from "./InputText";

const meta = {
  component: InputTextComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InputTextComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputText: Story = {
  args: {
    placeholder: "Input text",
  },
};
