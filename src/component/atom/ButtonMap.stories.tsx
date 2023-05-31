import type { Meta, StoryObj } from "storybook-solidjs";

import ButtonMap from "./ButtonMap";
import { FaSolidPlus } from "solid-icons/fa";
const Icon = () => <FaSolidPlus class="w-full p-0 h-2/3" />;

const meta = {
  title: "Map/Button",
  component: ButtonMap,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked tt" },
  },
} satisfies Meta<typeof ButtonMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const addLineEnable: Story = {
  args: {
    tooltip: "Test",
    icon: <Icon />,
    _class: true,
  },
};

export const addLineDisable: Story = {
  args: {
    tooltip: "Test",
    icon: <Icon />,
    _class: false,
  },
};
