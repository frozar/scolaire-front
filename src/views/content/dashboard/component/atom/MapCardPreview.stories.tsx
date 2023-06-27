import { Meta, StoryObj } from "storybook-solidjs";
import MapCardPreview from "./MapCardPreview";

const meta = {
  component: MapCardPreview,
  tags: ["autodocs"],
  argTypes: {
    preview: { control: "text" },
  },
} satisfies Meta<typeof MapCardPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const preview: Story = {
  args: {
    preview: "/map.png",
  },
};
