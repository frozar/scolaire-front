import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import { Filter as FilterComponent } from "./Filter";

const meta = {
  component: FilterComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FilterComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [isChecked, setIsChecked] = createSignal(false);

export const Filter: Story = {
  render: () => {
    return (
      <FilterComponent
        title="Filtre test"
        setter={setIsChecked}
        getter={isChecked}
      />
    );
  },
};
