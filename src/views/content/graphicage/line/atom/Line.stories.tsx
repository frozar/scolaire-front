import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import LineComponent from "./Line";

const meta = {
  component: LineComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LineComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineStory: Story = {
  render: (props: { latlngs: L.LatLng[]; color: string; opacity: number }) => {
    const div = document.getElementById("map-container");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <LineComponent {...props} leafletMap={initialiseMap("map-container")} />
      </div>
    );
  },
  args: {
    latlngs: [
      L.latLng(-20.9466588303741, 55.5343806753509),
      L.latLng(-20.9466588303743, 55.54),
      L.latLng(-20.942, 55.535),
    ],
    color: "orange",
    opacity: 1,
  },
};
