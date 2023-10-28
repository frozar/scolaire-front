import { Meta, StoryObj } from "storybook-solidjs";

import ModalComponent from "./Modal";

const meta = {
  component: ModalComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ModalComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DummyComponent() {
  return <h1>Dummy Component</h1>;
}

export const Modal: Story = {
  args: {
    show: true,
    children: DummyComponent,
  },
};
