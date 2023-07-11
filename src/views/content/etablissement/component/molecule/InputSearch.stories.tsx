import { Meta, StoryObj } from "storybook-solidjs";

import InputSearchComponent from "./InputSearch";

const meta = {
  component: InputSearchComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InputSearchComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputSearch: Story = {};
