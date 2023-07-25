import { LeafletMouseEvent } from "leaflet";
import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointEtablissementComponent, {
  PointEtablissementProps,
} from "./PointEtablissement";

const meta = {
  component: PointEtablissementComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof PointEtablissementComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointEtablissement: Story = {
  render: (props: PointEtablissementProps) => {
    const div = document.getElementById("map-container");

    if (div) {
      div.remove();
    }

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <PointEtablissementComponent
          {...props}
          map={initialiseMap("map-container")}
        />
      </div>
    );
  },

  args: {
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
