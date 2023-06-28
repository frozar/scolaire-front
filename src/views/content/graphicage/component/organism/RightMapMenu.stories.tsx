import { Meta, StoryObj } from "storybook-solidjs";
import AddLineButton from "./AddLineButton";
import ClearButton from "./ClearButton";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import InformationBoardButton from "./InformationBoardButton";
import RemoveLineButton from "./RemoveLineButton";
import RightMapMenu from "./RightMapMenu";

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
