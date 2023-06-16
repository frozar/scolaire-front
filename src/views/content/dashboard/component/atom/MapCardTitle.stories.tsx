import { Meta, StoryObj } from "storybook-solidjs";
import MapCardTitle from "./MapCardTitle";

const meta = {
  title: "Dashboard/Atom/MapCardTitle",
  component: MapCardTitle,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof MapCardTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const title: Story = {
  args: {
    title: "Map title",
  },
};
