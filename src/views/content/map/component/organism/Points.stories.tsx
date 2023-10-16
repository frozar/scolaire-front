import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { SchoolType } from "../../../../../_entities/school.entity";
import schoolsFixture from "./../../../../../../cypress/fixtures/schools.json";
import stopsFixture from "./../../../../../../cypress/fixtures/stops.json";

import { StopType } from "../../../../../_entities/stop.entity";
import { Points } from "./Points";

const meta = {
  component: Points,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof Points>;

export default meta;
type Story = StoryObj<typeof meta>;

const schools: SchoolType[] = schoolsFixture;
const stops: StopType[] = stopsFixture;

export const PointsStory: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);
    // TODO WARNING testMapId depends of local database.
    // Mock data to fetch
    return (
      <Points
        leafletMap={initialiseMap(fullId)}
        stops={stops}
        schools={schools}
      />
    );
  },
};
