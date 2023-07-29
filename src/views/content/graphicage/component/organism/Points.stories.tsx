import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import {
  Mapdecorators,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsComponent from "./Points";

const meta = {
  component: PointsComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
} satisfies Meta<typeof PointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Points: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return <PointsComponent map={initialiseMap(fullId, true)} mapId={2} />;
  },
};
