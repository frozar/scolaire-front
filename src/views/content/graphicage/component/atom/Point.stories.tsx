import "leaflet/dist/leaflet.css";

import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../.storybook/utils/mapWrapper";

import PointComponent from "./Point";

const meta = {
  component: PointComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

interface PointProps {
  idPoint: number;
  onIsLast: () => void;
  lat: number;
  lon: number;
  map: L.Map;
  onClick: () => void;
  borderColor: string;
  fillColor: string;
  isLast: boolean;
  onDBLClick: () => void;
  onMouseOut: () => void;
  onMouseOver: () => void;
  radius: number;
  weight: number;
  isBlinking: boolean;
}

export const Point: Story = {
  render: (props: PointProps) => {
    const div = document.getElementById("map-container");
    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointComponent {...props} map={initialiseMap("map-container")} />
      </div>
    );
  },
  args: {
    idPoint: 1,
    onIsLast: () => console.log("onIsLast"),
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    onClick: () => console.log("onClick"),
    borderColor: "red",
    fillColor: "white",
    isLast: false,
    onDBLClick: () => console.log("onDBLClick"),
    onMouseOut: () => console.log("onMouseOut"),
    onMouseOver: () => console.log("onMouseOver"),
    radius: 8,
    weight: 4,
    isBlinking: false,
  },
};
