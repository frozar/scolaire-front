import { Meta, StoryObj } from "storybook-solidjs";
import stops from "../../../../../../cypress/fixtures/stopsFromDB.json";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { StopPoints as StopPointsComponent } from "./StopPoints";
import { useStateGui } from "../../../../../StateGui";
const [, { getActiveMapId }] = useStateGui();
const meta = {
  component: StopPointsComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
  parameters: {
    mockData: [
      {
        url:
          import.meta.env.VITE_XANO_URL + "/map/" + getActiveMapId() + "/stop",
        method: "GET",
        status: 200,
        response: stops,
      },
    ],
  },
} satisfies Meta<typeof StopPointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StopPoints: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <StopPointsComponent leafletMap={initialiseMap(fullId)} />
      </div>
    );
  },
};
