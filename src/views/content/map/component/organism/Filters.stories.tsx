import { Meta, StoryObj } from "storybook-solidjs";

import { Filters as FiltersComponent } from "./Filters";

const meta = {
  component: FiltersComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FiltersComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filters: Story = {
  render: () => {
    return (
      <div class="relative w-1/2 h-[100px]">
        <FiltersComponent />
      </div>
    );
  },
};
