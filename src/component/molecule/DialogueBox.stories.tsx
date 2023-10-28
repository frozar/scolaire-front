import { Meta, StoryObj } from "storybook-solidjs";

import DialogueBoxComponent from "./DialogueBox";

const meta = {
  component: DialogueBoxComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof DialogueBoxComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DummyComponent() {
  return <h1>Dummy Component</h1>;
}

export const DialogueBox: Story = {
  args: {
    show: true,
    children: DummyComponent,
  },
};
