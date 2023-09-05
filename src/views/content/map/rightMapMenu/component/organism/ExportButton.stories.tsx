import { Meta, StoryObj } from "storybook-solidjs";

import ExportButtonComponent from "./ExportButton";

const meta = {
  component: ExportButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ExportButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExportButton: Story = {
  args: {
    handleClick: () => console.log("onClick on ExportButton"),
    xOffset: "right",
  },
};
