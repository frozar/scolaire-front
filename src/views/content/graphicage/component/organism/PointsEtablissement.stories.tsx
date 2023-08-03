import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import L, { LeafletMouseEvent } from "leaflet";
import {
  createPoint,
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsEtablissementComponent from "./PointsEtablissement";

const meta = {
  component: PointsEtablissementComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof PointsEtablissementComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointEtablissement: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <PointsEtablissementComponent
        leafletMap={initialiseMap(fullId)}
        mapId={2}
        onDBLClick={(event: LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
          console.log("onDBLClick, event:", event);
        }}
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
    );
  },
};
