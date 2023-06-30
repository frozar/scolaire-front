import { createSignal } from "solid-js";

import { Meta, StoryObj } from "storybook-solidjs";

import InformationBoardButtonComponent from "./InformationBoardButton";

const meta = {
  component: InformationBoardButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeGetDisplayedInformationBoard, setFakeDisplayedInformationBoard] =
  createSignal(false);

export const InformationBoardButton: Story = {
  args: {
    toggleDisplayedInformationBoard: () =>
      setFakeDisplayedInformationBoard((bool) => !bool),

    getDisplayedInformationBoard: fakeGetDisplayedInformationBoard,
    xOffset: "right",
  },
};
