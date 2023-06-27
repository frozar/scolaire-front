import { Meta, StoryObj } from "storybook-solidjs";
import RightMapMenu from "./RightMapMenu";
import InformationBoardButton from "../molecule/InformationBoardButton";
import AddLineButton from "../molecule/AddLineButton";
import RemoveLineButton from "../molecule/RemoveLineButton";
import ClearButton from "../molecule/ClearButton";
import GenerateButton from "../molecule/GenerateButton";
import ExportButton from "../molecule/ExportButton";

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
