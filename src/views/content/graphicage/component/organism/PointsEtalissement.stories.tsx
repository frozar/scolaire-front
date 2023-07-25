import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsEtablissementComponent, {
  PointsEtablissementProps,
} from "./PointsEtalissement";

const meta = {
  component: PointsEtablissementComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointsEtablissementComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [myMap, setMyMap] = createSignal<L.Map>();

function getMyMap() {
  if (!myMap()) {
    const returnedMap = initialiseMap("map-container");
    setMyMap(returnedMap);
    return returnedMap;
  } else {
    return myMap();
  }
}

export const PointRamassage: Story = {
  render: (props: PointsEtablissementProps) => {
    const div = document.getElementById("map-container");
    console.log("div:", div);

    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointsEtablissementComponent
          {...props}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          map={getMyMap()}
        />
      </div>
    );
  },

  args: {
    mapID: 2,
  },
};
