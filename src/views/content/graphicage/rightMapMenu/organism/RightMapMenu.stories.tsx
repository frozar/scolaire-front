import { Meta, StoryObj } from "storybook-solidjs";
import RightMapMenu from "./RightMapMenu";
import InformationBoardButton from "../../component/organism/InformationBoardButton";
import AddLineButton from "../../component/organism/AddLineButton";
import RemoveLineButton from "../../component/organism/RemoveLineButton";
import ClearButton from "../../component/organism/ClearButton";
import GenerateButton from "../../component/organism/GenerateButton";
import ExportButton from "../../component/organism/ExportButton";

const meta = {
  component: RightMapMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof RightMapMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RightMenu: Story = {
  args: {
    children: (
      <>
        <InformationBoardButton />
        <AddLineButton />
        <RemoveLineButton />
        <ClearButton />
        <GenerateButton />
        <ExportButton />
      </>
    ),
  },
};
