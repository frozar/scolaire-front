import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  createPoint,
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { PointStorybook } from "../atom/Point.stories";
import PointEtablissementComponent from "./PointEtablissement";

const meta = {
  component: PointEtablissementComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof PointEtablissementComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointEtablissement: Story = {
  render: (props: PointStorybook, options) => {
    const fullId = getDivFullId(options);

    return (
      <PointEtablissementComponent
        point={createPoint({
          id: 1,
          idPoint: 1,
          lat: -20.9466588303741,
          lon: 55.5343806753509,
          name: "name",
          quantity: 5,
        })}
        map={initialiseMap(fullId)}
        {...props}
      />
    );
  },

  args: {
    isBlinking: false,
    weight: 4,
    radius: 8,
    borderColor: "red",
    fillColor: "white",
  },
};
