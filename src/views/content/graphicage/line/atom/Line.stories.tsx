import L from "leaflet";
import { Meta, StoryObj } from "storybook-solidjs";
import { layerTilesList } from "../../constant";
import Line from "./Line";

const meta = {
  component: Line,
} satisfies Meta<typeof Line>;

export default meta;
type Story = StoryObj<typeof meta>;
let map: L.Map;

export const MyLine: Story = {
  render: (props: {
    latlngs: L.LatLng[];
    leafletMap: L.Map;
    color: string;
    opacity: number;
  }) => {
    console.log("map", map);
    if (map != undefined) {
      map.off();
      map.remove();
    }

    map = L.map("storybook-root").setView(
      [-20.9466588303741, 55.5343806753509],
      14
    );
    console.log("map", map);
    layerTilesList[0].tileContent.addTo(map);

    return (
      <>
        <div id="map-container" style={{ width: "100%", height: "500px" }} />

        <Line
          latlngs={props.latlngs}
          leafletMap={map}
          color={props.color}
          opacity={props.opacity}
        />
      </>
    );
  },
  args: {
    latlngs: [
      L.latLng(-20.9466588303741, 55.5343806753509),
      L.latLng(-20.9466588303743, 55),
    ],
    color: "orange",
    opacity: 10,
  },
};
