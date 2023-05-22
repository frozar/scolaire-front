import { Meta, StoryObj } from "storybook-solidjs";
import MapGridHeaderComponent from "./MapGridHeader";

const meta = {
  title: "Dashboard/Molecule/MapGridHeader",
  component: MapGridHeaderComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapGridHeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MapGridHeader: Story = {
  args: {
    openCreateMap: () => {
      console.log("call openCreateMap");
    },
  },
};
