import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  createPoint,
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import RamassagePointsComponent from "./PointsRamassage";

const meta = {
  component: RamassagePointsComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof RamassagePointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RamassagePoints: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <div id="map-container" style={{ width: "100%", height: "500px" }}>
        <RamassagePointsComponent
          leafletMap={initialiseMap(fullId)}
          mapId={2}
          items={[
            createPoint({
              id: 1,
              idPoint: 1,
              lat: -20.9666588303741,
              lon: 55.5343806753509,
              name: "name",
              quantity: 5,
            }),
            createPoint({
              id: 1,
              idPoint: 1,
              lat: -20.9466588303741,
              lon: 55.5343806753519,
              name: "name",
              quantity: 5,
            }),
          ]}
        />
      </div>
    );
  },
};
