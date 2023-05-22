import { Meta, StoryObj } from "storybook-solidjs";
import MapCardComponent from "./MapCard";

const meta = {
  title: "Dashboard/Molecule/MapCard",
  component: MapCardComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MapCard: Story = {
  args: {
    title: "Storybook essaie",
    handleClickDelete: () => {
      console.log("call handleClickDelete");
    },
    editMapModal: () => {
      console.log("call editMapModal");
    },
  },
};
