import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

// TODO: Fix not working if PointsEtablissement and PointsRamassage stories
// not opened first
// TODO: Use fixtures ?
// TODO: Fix blinking

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

    return <PointsComponent map={initialiseMap(fullId)} mapId={2} />;
  },
};
