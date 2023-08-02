import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import {
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsComponent from "./Points";

const meta = {
  component: PointsComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof PointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Points: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);
    const testMapId = 3;
    // TODO WARNING testMapId depends of local database.
    // Mock data to fetch
    return (
      <PointsComponent leafletMap={initialiseMap(fullId)} mapId={testMapId} />
    );
  },
};
