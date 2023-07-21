// import { Meta, StoryObj } from "storybook-solidjs";

// import MapWithPointComponent from "./Point.mapWrapper.story";

// const meta = {
//   component: MapWithPointComponent,
// } satisfies Meta<typeof MapWithPointComponent>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const EtablissementPoint: Story = {
//   args: {
//     radius: 12,
//     weight: 4,
//     borderColor: "green",
//     fillColor: "white",
//     isBlinking: false,
//   },
// };

// export const RamassagePoint: Story = {
//   args: {
//     radius: 5,
//     weight: 2,
//     borderColor: "red",
//     fillColor: "white",
//     isBlinking: false,
//   },
// };

import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import { initMap } from "../../../../../../.storybook/utils/mapWrapper";
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
        <PointComponent {...props} map={initMap("map-container")} />
      </div>
    );
  },
  args: {
    idPoint: 1,
    onIsLast: () => console.log("ok"),
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
