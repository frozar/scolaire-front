import { Meta, StoryObj } from "storybook-solidjs";

import ExportButtonComponent from "./ExportButton";

const meta = {
  component: ExportButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ExportButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// function fakeHandleClick() {
//   console.log("fakeExportButtonHandleClick");
//   return;
// }

export const ExportButton: Story = {
  args: {
    // handleClick: fakeHandleClick,
    handleClick: () => null,
    xOffset: "right",
  },
};
