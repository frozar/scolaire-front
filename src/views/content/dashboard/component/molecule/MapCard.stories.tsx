import { Meta, StoryObj } from "storybook-solidjs";
import MapCardComponent from "./MapCard";
import { createSignal } from "solid-js";
import { shouldExit } from "./MapGrid";

const meta = {
  title: "Dashboard/Molecule/MapCard",
  component: MapCardComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [fakeIsActive, setFakeIsActive] = createSignal(false);
const [fakeIsSelected, setFakeIsSelected] = createSignal(false);

const toggleFakeIsActive = () => {
  setFakeIsActive((bool) => !bool);
};

const selectFakeIsSelected = () => {
  setFakeIsSelected(true);
};

const unselectFakeIsSelected = () => {
  setFakeIsSelected(false);
};

export const MapCard: Story = {
  args: {
    mapCard: {
      id: 1,
      name: "Storybook essaie",
      isSelected: fakeIsSelected,
      isActive: fakeIsActive,
    },
    select: (event: MouseEvent) => {
      if (shouldExit(event)) {
        return;
      }

      console.log("call handleClickDelete");
      selectFakeIsSelected();
    },
    unselect: () => {
      unselectFakeIsSelected();
    },
    handleDblClick: (event: MouseEvent) => {
      if (shouldExit(event)) {
        return;
      }

      console.log("call handleDblClickHandler");
      toggleFakeIsActive();
      console.log("fakeIsActive()", fakeIsActive());
    },
    handleClickDelete: () => {
      console.log("call handleClickDelete");
    },
  },
};
