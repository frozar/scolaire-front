// TODO Have to Mock the fetch https://storybook-addon-mock.netlify.app - first have to setup the MapId

import { Meta, StoryObj } from "storybook-solidjs";
import stops from "../../../../../../cypress/fixtures/stopsUnformated.json";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { StopPoints } from "./StopPoints";
import { useStateGui } from "../../../../../StateGui";
const [, { getActiveMapId }] = useStateGui();
const meta = {
  component: StopPoints,
  tags: ["autodocs"],
  decorators: mapDecorators,
  parameters: {
    mockData: [
      {
        url:
          "https://x8ki-letl-twmt.n7.xano.io/api:DL_gv4vw/map/" +
          getActiveMapId() +
          "/stop",
        method: "GET",
        status: 200,
        response: stops,
      },
    ],
  },
} satisfies Meta<typeof StopPoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RamassagePoints: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <StopPoints leafletMap={initialiseMap(fullId)} />
      </div>
    );
  },
};
