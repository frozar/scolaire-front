import { LeafletMouseEvent } from "leaflet";
import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import { createSignal } from "solid-js";
import { createPoint } from "../../../../../../testing/utils/TestUtils";
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
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <RamassagePointsComponent
          {...props}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map={getMyMap()}
          items={[
            createPoint({
              id: 1,
              idPoint: 1,
              lat: -20.9666588303741,
              lon: 55.5343806753509,
              name: "name",
              quantity: 5,
            }),
            createPoint({
              id: 1,
              idPoint: 1,
              lat: -20.9466588303741,
              lon: 55.5343806753519,
              name: "name",
              quantity: 5,
            }),
          ]}
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
