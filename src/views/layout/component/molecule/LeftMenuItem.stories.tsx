import { Meta, StoryObj } from "storybook-solidjs";
import GraphicageLogo from "../../../../icons/GraphicageLogo";
import LeftMenuItemComponent from "./LeftMenuItem";

const meta = {
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
