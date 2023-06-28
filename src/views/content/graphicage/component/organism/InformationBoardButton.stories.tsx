import { Meta, StoryObj } from "storybook-solidjs";

import InformationBoardButtonComponent from "./InformationBoardButton";

const meta = {
  component: InformationBoardButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof InformationBoardButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InformationBoardButton: Story = {
  args: {
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
