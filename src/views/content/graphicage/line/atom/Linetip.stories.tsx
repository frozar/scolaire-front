import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import LineTipComponent from "./Line";
import LineTip from "./LineTip";

const meta = {
  component: LineTipComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LineTipComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineTipStory: Story = {
  render: (props: { latlng: L.LatLng; color: string; opacity: number }) => {
    const div = document.getElementById("map-container");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <LineTip {...props} leafletMap={initialiseMap("map-container")} />
      </div>
    );
  },
  args: {
    latlng: L.latLng(-20.9466588303741, 55.5343806753509),
    color: "orange",
    opacity: 1,
  },
};
