import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import {
  Mapdecorators,
  createPoint,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import PointsEtablissementComponent from "./PointsEtalissement";

const meta = {
  component: PointsEtablissementComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
} satisfies Meta<typeof PointsEtablissementComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointeEtablissement: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <PointsEtablissementComponent
        map={initialiseMap(fullId)}
        mapID={2}
        items={[
          createPoint(1, 50, -20.9466588303741, 55.5343806753509, "name", 5),
          createPoint(2, 51, -20.9466588303741, 55.5343806753519, "name", 5),
        ]}
      />
    );
  },
};
