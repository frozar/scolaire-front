import { Meta, StoryObj } from "storybook-solidjs";
import MapCardComponent from "./MapCard";
import { createSignal } from "solid-js";

const meta = {
  title: "Dashboard/Molecule/MapCard",
  component: MapCardComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MapCardComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

function hasButtonAsParent(elt: HTMLElement) {
  if (
    !(elt.tagName === "DIV" && elt.classList.contains("map-card-container"))
  ) {
    if (elt.tagName === "BUTTON") {
      return true;
    } else {
      if (!elt.parentElement) {
        return false;
      }
      return hasButtonAsParent(elt.parentElement);
    }
  } else {
    return false;
  }
}

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
    handleClick: (event: MouseEvent) => {
      if (!event.target) {
        return;
      }

      if (hasButtonAsParent(event.target as HTMLElement)) {
        return;
      }
      console.log("call handleClickDelete");
      selectFakeIsSelected();
    },
    handleDblClick: (event: MouseEvent) => {
      if (!event.target) {
        return;
      }

      if (hasButtonAsParent(event.target as HTMLElement)) {
        return;
      }
      console.log("call handleDblClickHandler");
      toggleFakeIsActive();
      console.log("fakeIsActive()", fakeIsActive());
    },
    handleClickDelete: () => {
      console.log("call handleClickDelete");
    },
    unselect: () => {
      unselectFakeIsSelected();
    },
  },
};
