import "leaflet/dist/leaflet.css";

import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import PointComponent, { PointProps } from "./Point";

const meta = {
  component: PointComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointStories: Story = {
  render: (props: PointProps) => {
    const div = document.getElementById("map-container-1");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container-1" style={{ width: "100%", height: "500px" }}>
        <PointComponent {...props} map={initialiseMap("map-container-1")} />
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
    isLast: false,
    onIsLast: () => console.log("onIsLast"),
    onClick: () => console.log("onClick"),
    onDBLClick: () => console.log("onDBLClick"),
    onMouseOut: () => console.log("onMouseOut"),
    onMouseOver: () => console.log("onMouseOver"),
  },
};

export const PointStories2: Story = {
  render: (props: PointProps) => {
    const div = document.getElementById("map-container-2");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container-2" style={{ width: "100%", height: "500px" }}>
        <PointComponent {...props} map={initialiseMap("map-container-2")} />
      </div>
    );
  },
  args: {
    idPoint: 1,
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    isBlinking: false,
    borderColor: "green",
    fillColor: "white",
    weight: 4,
    radius: 12,
    isLast: false,
    onIsLast: () => console.log("onIsLast"),
    onClick: () => console.log("onClick"),
    onDBLClick: () => console.log("onDBLClick"),
    onMouseOut: () => console.log("onMouseOut"),
    onMouseOver: () => console.log("onMouseOver"),
  },
};
