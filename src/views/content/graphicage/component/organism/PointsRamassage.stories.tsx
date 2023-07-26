import { LeafletMouseEvent } from "leaflet";
import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import { createSignal } from "solid-js";
import RamassagePointsComponent, {
  RamassagePointsProps,
} from "./PointsRamassage";

const meta = {
  component: RamassagePointsComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof RamassagePointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [myMap, setMyMap] = createSignal();

function getMyMap() {
  if (!myMap()) {
    const returnedMap = initialiseMap("map-container");
    setMyMap(returnedMap);
    return returnedMap;
  } else {
    return myMap();
  }
}

export const RamassagePoints: Story = {
  render: (props: RamassagePointsProps) => {
    const div = document.getElementById("map-container");
    // const map = initialiseMap("map-container");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <RamassagePointsComponent
          {...props}
          // map={map}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map={getMyMap()}
        />
      </div>
    );
  },

  args: {
    mapId: 4,
  },

  argTypes: {
    onIsLast: () => console.log("onIsLast"),
    onClick: () => console.log("onClick"),
    onDBLClick: (event: LeafletMouseEvent) =>
      console.log("onDBLClick, event:", event),
    onMouseOver: () => console.log("onMouseOver"),
    onMouseOut: () => console.log("onMouseOut"),
  },
};
