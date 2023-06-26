import { Meta, StoryObj } from "storybook-solidjs";
import LeftMenuItemComponent from "./LeftMenuItem";
import GraphicageLogo from "../../../../../component/atom/GraphicageLogo";

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
    isSelected: true,
  },
  argTypes: {
    onClick: () => console.log("ok"),
  },
};
