import { Meta, StoryObj } from "storybook-solidjs";

import LeftMenuItemLabelComponent from "./LeftMenuItemLabel";

const meta = {
  component: LeftMenuItemLabelComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftMenuItemLabelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftMenuItemLabel: Story = {
  args: {
    isActive: false,
    isDisabled: false,
  },
  argTypes: {
    label: {
      options: ["Graphicage", "Etablissement"],
      control: "select",
    },
  },
};
