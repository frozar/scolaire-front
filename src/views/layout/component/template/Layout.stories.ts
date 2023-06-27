import { Meta, StoryObj } from "storybook-solidjs";

import LayoutComponent from "./Layout";

const meta = {
  component: LayoutComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LayoutComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Layout: Story = {};
