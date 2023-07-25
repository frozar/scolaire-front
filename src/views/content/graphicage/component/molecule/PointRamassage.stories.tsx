import { LeafletMouseEvent } from "leaflet";
import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import PointRamassageComponent, { PointRamassageProps } from "./PointRamassage";

const meta = {
  component: PointRamassageComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointRamassageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointEtablissement: Story = {
  render: (props: PointRamassageProps) => {
    const div = document.getElementById("map-container");

    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointRamassageComponent
          {...props}
          map={initialiseMap("map-container")}
        />
      </div>
    );
  },

  args: {
    quantity: 6,
    minQuantity: 1,
    maxQuantity: 25,

    idPoint: 50,
    lat: -20.9466588303741,
    lon: 55.5343806753509,
    isLast: false,
    isBlinking: false,
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
