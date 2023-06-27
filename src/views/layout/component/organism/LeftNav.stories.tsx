import { createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";

import LeftNavComponent from "./LeftNav";

const meta = {
  component: LeftNavComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftNavComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeGetDisplayedLeftMenu, fakeSetDisplayedLeftMenu] =
  createSignal(false);

function toggleFakeDisplayedLeftMenu() {
  fakeSetDisplayedLeftMenu((bool) => !bool);
}

export const LeftNav: Story = {
  args: {
    displayedLabel: true,
    getDisplayedLeftMenu: fakeGetDisplayedLeftMenu,
    toggleDisplayedLeftMenu: toggleFakeDisplayedLeftMenu,
  },
};
