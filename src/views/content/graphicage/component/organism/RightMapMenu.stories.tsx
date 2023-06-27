import { Meta, StoryObj } from "storybook-solidjs";
import RightMapMenu from "./RightMapMenu";
import InformationBoardButton from "./InformationBoardButton";
import AddLineButton from "./AddLineButton";
import RemoveLineButton from "./RemoveLineButton";
import ClearButton from "./ClearButton";
import GenerateButton from "./GenerateButton";
import ExportButton from "./ExportButton";

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
