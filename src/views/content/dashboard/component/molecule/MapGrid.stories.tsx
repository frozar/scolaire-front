import { Meta, StoryObj } from "storybook-solidjs";
import MapGridComponent from "./MapGrid";
import { createSignal } from "solid-js";

const meta = {
  component: MapGridComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapGridComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function getMapList() {
  const mapList = [];

  for (let i = 0; i < 10; i++) {
    const [isActive, setIsActive] = createSignal(false);
    const [isSelected, setIsSelected] = createSignal(false);
    mapList.push({
      id: i,
      name: `Title ${i}`,
      isActive,
      isSelected,
      setIsSelected,
      setIsActive,
    });
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
