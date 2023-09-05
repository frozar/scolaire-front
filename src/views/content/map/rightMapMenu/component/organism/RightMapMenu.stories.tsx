import { Meta, StoryObj } from "storybook-solidjs";

import RightMapMenuComponent from "./RightMapMenu";

const meta = {
  component: RightMapMenuComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof RightMapMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightMapMenu: Story = {
  args: {
    xOffset: "right",
  },
};
