import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import { splitProps } from "solid-js";
import {
  createPoint,
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import { PointStorybook } from "../atom/Point.stories";
import PointRamassageComponent from "./PointRamassage";

const meta = {
  component: PointRamassageComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
} satisfies Meta<typeof PointRamassageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointRamassage: Story = {
  render: (props: PointStorybook, options) => {
    const fullId = getDivFullId(options);
    const [local, others] = splitProps(props, [
      "maxQuantity",
      "minQuantity",
      "quantity",
    ]);

    return (
      <PointRamassageComponent
        point={createPoint({
          id: 1,
          idPoint: 1,
          lat: -20.9466588303741,
          lon: 55.5343806753509,
          name: "name",
          quantity: 5,
        })}
        map={initialiseMap(fullId)}
        maxQuantity={local.maxQuantity as number}
        minQuantity={local.minQuantity as number}
        {...others}
      />
    );
  },

  args: {
    isBlinking: false,
    borderColor: "red",
    fillColor: "white",
    maxQuantity: 30,
    minQuantity: 1,
  },
};
