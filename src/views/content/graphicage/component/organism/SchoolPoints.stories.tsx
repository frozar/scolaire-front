import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import schools from "../../../../../../cypress/fixtures/schoolsFromDB.json";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { useStateGui } from "../../../../../StateGui";
import { SchoolPoints as SchoolPointsComponent } from "./SchoolPoints";
const [, { getActiveMapId }] = useStateGui();

const meta = {
  component: SchoolPointsComponent,
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
    ],
  },
} satisfies Meta<typeof SchoolPointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SchoolPoints: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return <SchoolPointsComponent leafletMap={initialiseMap(fullId)} />;
  },
};
