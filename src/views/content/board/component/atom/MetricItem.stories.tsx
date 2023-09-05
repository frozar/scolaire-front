import { Meta, StoryObj } from "storybook-solidjs";
import { MetricItem } from "./MetricItem";

const meta = {
  component: MetricItem,
  tags: ["autodocs"],
} satisfies Meta<typeof MetricItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricItemStoryValueNull: Story = {
  args: {
    title: "Distance parcourue",
  },
};

export const MetricItemStory: Story = {
  args: {
    title: "Distance parcourue",
    value: 10,
    unite: "km",
  },
};
