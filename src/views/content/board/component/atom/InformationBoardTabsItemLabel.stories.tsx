import { Meta, StoryObj } from "storybook-solidjs";
import { InformationBoardTabsItemLabel } from "./InformationBoardTabsItemLabel";

const meta = {
  component: InformationBoardTabsItemLabel,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardTabsItemLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardTabsItemLabelStory: Story = {
  args: {
    isActive: false,
    label: "Informations",
  },
};
