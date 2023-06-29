import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import InformationBoardButtonComponent from "./InformationBoardButton";

const meta = {
  component: InformationBoardButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeGetDisplayedInformationBoard, setFakeDisplayedInformationBoard] =
  createSignal(false);

function fakeToggleDisplayedInformationBoard() {
  console.log("fakeToggleDisplayedInformationBoard");

  setFakeDisplayedInformationBoard((bool) => !bool);
}

export const InformationBoardButton: Story = {
  args: {
    toggleDisplayedInformationBoard: fakeToggleDisplayedInformationBoard,
    getDisplayedInformationBoard: fakeGetDisplayedInformationBoard,
    xOffset: "right",
    // children: (
    //   <>
    //     <InformationBoardButtonComponent xOffset="right" />
    //     {/* <AddLineButton xOffset="right" />
    //     <RemoveLineButton xOffset="right" />
    //     <ClearButton xOffset="right" />
    //     <GenerateButton xOffset="right" />
    //     <ExportButton xOffset="right" /> */}
    //   </>
    // ),
  },
};
// InformationBoardButton.story = {
//   name: "InformationBoardButton", // Set a name for the story
// };
