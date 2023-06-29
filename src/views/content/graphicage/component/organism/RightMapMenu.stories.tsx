import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import RightMapMenuComponent from "./RightMapMenu";

const meta = {
  component: RightMapMenuComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof RightMapMenuComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// const informationBoardProps = {
//   icon: (() => BsInfoCircle({ class: "h-10 w-10" })) as Element,
//   onClick: toggleDisplayedInformationBoard,
//   tooltip: "Afficher le panneau d'information",
//   isActive: getDisplayedInformationBoard(),
//   xOffset: "left" as OffsetType,
// };

const [fakeGetDisplayedInformationBoard, setFakeDisplayedInformationBoard] =
  createSignal(false);

function fakeToggleDisplayedInformationBoard() {
  console.log("fakeToggleDisplayedInformationBoard");

  setFakeDisplayedInformationBoard((bool) => !bool);
}

export const RightMapMenu: Story = {
  args: {
    toggleDisplayedInformationBoard: fakeToggleDisplayedInformationBoard,
    getDisplayedInformationBoard: fakeGetDisplayedInformationBoard,
    xOffset: "right",
  },
};
