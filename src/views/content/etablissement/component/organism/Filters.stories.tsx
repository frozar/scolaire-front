import { Meta, StoryObj } from "storybook-solidjs";

import FiltersComponent from "./Filters";

const meta = {
  component: FiltersComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FiltersComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filters: Story = {};
