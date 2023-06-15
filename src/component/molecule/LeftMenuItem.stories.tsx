import { Meta, StoryObj } from "storybook-solidjs";
import LeftMenuItemComponent from "./LeftMenuItem";
import GraphicageLogo from "../atom/GraphicageLogo";
import { createSignal } from "solid-js";

const meta = {
  title: "LeftNav/Item/Item",
  component: LeftMenuItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftMenuItemComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ItemGraphicage: Story = {
  args: {
    label: "Graphicage",
    Logo: GraphicageLogo,
    displayedLabel: true,
    isDisabled: false,
    isSelected: () => true,
  },
  argTypes: {
    onClick: () => console.log("ok"),
  },
};

const [fakeIsSelected, setFakeIsSelected] = createSignal(false);

function toggleFakeIsSelected() {
  setFakeIsSelected((bool) => !bool);
}

export const ItemFakeActive: Story = {
  args: {
    label: "Graphicage",
    Logo: GraphicageLogo,
    displayedLabel: true,
    isDisabled: false,
    isSelected: fakeIsSelected,
    onClick: toggleFakeIsSelected,
  },
  parameters: {
    isDisabled: false,
  },
};
