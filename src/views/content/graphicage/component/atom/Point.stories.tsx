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

function onIsLast() {
  return;
}
function onClick() {
  console.log("onClick");
}
function onDBLClick() {
  console.log("onDBLClick");
}
function onMouseOut() {
  console.log("onMouseOut");
}
function onMouseOver() {
  console.log("onMouseOver");
}

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
    point: {
      idPoint: 1,
      lat: -20.9466588303741,
      lon: 55.5343806753509,
    },
    isBlinking: false,
    weight: 4,
    radius: 8,
    borderColor: "red",
    fillColor: "white",
    isLast: false,
    onIsLast: onIsLast,
    onClick: onClick,
    onDBLClick: onDBLClick,
    onMouseOut: onMouseOut,
    onMouseOver: onMouseOver,
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
    isBlinking: false,
    weight: 4,
    radius: 12,
    point: {
      idPoint: 1,
      lat: -20.9466588303741,
      lon: 55.5343806753509,
    },
    borderColor: "green",
    fillColor: "white",
    isLast: false,
    onIsLast: onIsLast,
    onClick: onClick,
    onDBLClick: onDBLClick,
    onMouseOut: onMouseOut,
    onMouseOver: onMouseOver,
  },
};
