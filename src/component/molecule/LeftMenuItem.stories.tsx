import { Meta, StoryObj } from "storybook-solidjs";
import LeftMenuItemComponent from "./LeftMenuItem";
import GraphicageLogo from "../../views/layout/leftMenu/logo/GraphicageLogo";

const meta = {
  title: "LeftNav/MenuItem",
  component: LeftMenuItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LeftMenuItemComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const MenuItem: Story = {
  args: {
    title: "Graphicage",
    menuItem: "graphicage",
    Logo: GraphicageLogo,
    isActiveText: true,
    isActiveItem: true,
    onClick: () => console.log("ok"),
  },
};
