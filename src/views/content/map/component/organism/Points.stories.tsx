import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import stops from "../../../../../../cypress/fixtures/stopsFromDB.json";
import schools from "../../../../../../cypress/fixtures/schoolsFromDB.json";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { Points } from "./Points";
import { useStateGui } from "../../../../../StateGui";
const [, { getActiveMapId }] = useStateGui();

const meta = {
  component: Points,
  tags: ["autodocs"],
  decorators: mapDecorators,
  parameters: {
    mockData: [
      {
        url:
          import.meta.env.VITE_XANO_URL +
          "/map/" +
          getActiveMapId() +
          "/school",
        method: "GET",
        status: 200,
        response: schools,
      },
      {
        url:
          import.meta.env.VITE_XANO_URL + "/map/" + getActiveMapId() + "/stop",
        method: "GET",
        status: 200,
        response: stops,
      },
    ],
  },
} satisfies Meta<typeof Points>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointsStory: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);
    // TODO WARNING testMapId depends of local database.
    // Mock data to fetch
    return <Points leafletMap={initialiseMap(fullId)} />;
  },
};
