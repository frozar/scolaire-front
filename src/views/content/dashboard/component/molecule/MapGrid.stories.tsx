import { Meta, StoryObj } from "storybook-solidjs";
import MapGridComponent from "./MapGrid";

const meta = {
  title: "Dashboard/Molecule/MapGrid",
  component: MapGridComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapGridComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function getMapList() {
  const mapList = [];
  for (let i = 0; i < 10; i++) {
    mapList.push({ id: i, name: `Title ${i}` });
  }
  return mapList;
}

export const MapGrid: Story = {
  args: {
    mapList: getMapList(),
    handleClickDelete: () => {
      console.log("call handleClickDelete");
    },
  },
};
