import { Meta, StoryObj } from "storybook-solidjs";
import PageTitle from "./PageTitle";

const meta = {
  component: PageTitle,
  tags: ["autodocs"],
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {};
