import { Meta, StoryObj } from "storybook-solidjs";
import TopNav from "./TopNav";

const meta = {
  component: TopNav,
  tags: ["autodocs"],
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopNavigation: Story = {};
