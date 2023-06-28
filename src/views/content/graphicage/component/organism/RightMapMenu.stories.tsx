import { Meta, StoryObj } from "storybook-solidjs";

import RightMapMenuComponent from "./RightMapMenu";

// const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
//   useStateGui();

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

export const RightMapMenu: Story = {
  args: {
    xOffset: "right",
    // children: (
    //   <>
    //     <InformationBoardButton xOffset="right" />
    //     <ButtonGraphicageRightMenu {...informationBoardProps} />
    //     {/* <AddLineButton xOffset="right" />
    //     <RemoveLineButton xOffset="right" />
    //     <ClearButton xOffset="right" />
    //     <GenerateButton xOffset="right" />
    //     <ExportButton xOffset="right" /> */}
    //   </>
    // ),
  },
};
