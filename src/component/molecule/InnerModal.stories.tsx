import { Meta, StoryObj } from "storybook-solidjs";

import InnerModalComponent from "./InnerModal";

const meta = {
  component: InnerModalComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InnerModalComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DummyComponent() {
  return <h1>Dummy Component</h1>;
}

export const InnerModal: Story = {
  args: {
    show: true,
    children: DummyComponent,
  },
};
