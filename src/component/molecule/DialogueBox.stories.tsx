import { Meta, StoryObj } from "storybook-solidjs";

import DialogueBoxComponent from "./DialogueBox";

const meta = {
  component: DialogueBoxComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof DialogueBoxComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DummyComponent() {
  return (
    <div class="flex h-full items-center justify-center">
      <h1>Dummy Component</h1>
    </div>
  );
}

export const DialogueBox: Story = {
  args: {
    show: true,
    children: DummyComponent,
  },
};
