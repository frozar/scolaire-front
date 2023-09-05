import { Meta, StoryObj } from "storybook-solidjs";
import LabelComponent from "./Label";

const meta = {
  component: LabelComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LabelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: { label: string; for?: string }) => {
    return <LabelComponent {...props} />;
  },

  args: {
    label: "Label text",
    for: "input-id",
  },
};
