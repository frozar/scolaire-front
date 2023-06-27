import { Meta, StoryObj } from "storybook-solidjs";
import LeftMenuItemListComponent from "../component/organism/LeftMenuItemList";
import { createSignal } from "solid-js";
import { SelectedMenuType } from "../../../type";

const meta = {
  title: "LeftNav/LeftMenuItemList",
  component: LeftMenuItemListComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftMenuItemListComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [getSelectedMenu, setSelectedMenu] =
  createSignal<SelectedMenuType>("graphicage");

export const LeftMenuItemList: Story = {
  args: {
    displayedLabel: true,
    getSelectedMenu,
    setSelectedMenu,
  },
};
