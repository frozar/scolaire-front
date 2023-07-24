import "leaflet/dist/leaflet.css";

import { Meta, StoryObj } from "storybook-solidjs";
import { initMap } from "../../../../../../testing/utils/mapWrapper";

import PointComponent, { PointProps } from "./Point";

const meta = {
  component: PointComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Point: Story = {
  render: (props: PointProps) => {
    const div = document.getElementById("map-container");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointComponent {...props} map={initMap("map-container")} />
      </div>
    );
  },
  args: {
    idPoint: 1,
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    isBlinking: false,
    borderColor: "red",
    fillColor: "white",
    weight: 4,
    radius: 8,
    onIsLast: () => console.log("onIsLast"),
    onClick: () => console.log("onClick"),
    onDBLClick: () => console.log("onDBLClick"),
    onMouseOut: () => console.log("onMouseOut"),
    onMouseOver: () => console.log("onMouseOver"),
  },
};
