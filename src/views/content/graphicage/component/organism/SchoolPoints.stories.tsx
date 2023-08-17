import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import schools from "../../../../../../cypress/fixtures/stopsFromDB.json";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { useStateGui } from "../../../../../StateGui";
import { SchoolPoints } from "./SchoolPoints";
const [, { getActiveMapId }] = useStateGui();

const meta = {
  component: SchoolPoints,
  tags: ["autodocs"],
  decorators: mapDecorators,
  parameters: {
    mockData: [
      {
        url:
          "https://x8ki-letl-twmt.n7.xano.io/api:DL_gv4vw/map/" +
          getActiveMapId() +
          "/school",
        method: "GET",
        status: 200,
        response: schools,
      },
    ],
  },
} satisfies Meta<typeof SchoolPoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointEtablissement: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return <SchoolPoints leafletMap={initialiseMap(fullId)} />;
  },
};
