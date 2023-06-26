import { createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";

import LayoutComponent from "./Layout";

const meta = {
  title: "Templates/Layout",
  component: LayoutComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LayoutComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeGetDisplayedLeftMenu, fakeSetDisplayedLeftMenu] =
  createSignal(false);

function toggleFakeDisplayedLeftMenu() {
  fakeSetDisplayedLeftMenu((bool) => !bool);
}

export const Layout: Story = {
  args: {
    getDisplayedLeftMenu: fakeGetDisplayedLeftMenu,
    toggleDisplayedLeftMenu: toggleFakeDisplayedLeftMenu,
  },
};
