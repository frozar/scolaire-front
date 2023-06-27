import { Meta, StoryObj } from "storybook-solidjs";
import RightMapMenu from "./RightMapMenu";
import InformationBoardButton from "../../views/content/graphicage/rightMapMenu/InformationBoardButton";
import AddLineButton from "../../views/content/graphicage/rightMapMenu/AddLineButton";
import RemoveLineButton from "../../views/content/graphicage/rightMapMenu/RemoveLineButton";
import ClearButton from "../../views/content/graphicage/rightMapMenu/ClearButton";
import GenerateButton from "../../views/content/graphicage/rightMapMenu/GenerateButton";
import ExportButton from "../../views/content/graphicage/rightMapMenu/ExportButton";

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
