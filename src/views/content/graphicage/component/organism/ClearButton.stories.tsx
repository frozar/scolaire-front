import { Meta, StoryObj } from "storybook-solidjs";

import ClearButtonComponent from "./ClearButton";

const meta = {
  component: ClearButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ClearButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClearButton: Story = {
  args: {
    handleClick: () => console.log("onClick on ClearButton"),
    xOffset: "right",
  },
};
