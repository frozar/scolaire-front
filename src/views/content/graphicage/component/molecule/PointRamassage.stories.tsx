import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import { LeafletMouseEvent } from "leaflet";
import { splitProps } from "solid-js";
import {
  Mapdecorators,
  createPoint,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import { PointStorybook } from "../atom/Point.stories";
import PointRamassageComponent from "./PointRamassage";

const meta = {
  component: PointRamassageComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
  argTypes: {
    onIsLast: () => console.log("onIsLast"),
    onClick: () => console.log("onClick"),
    onDBLClick: (event: LeafletMouseEvent) =>
      console.log("onDBLClick, event:", event),
    onMouseOver: () => console.log("onMouseOver"),
    onMouseOut: () => console.log("onMouseOut"),
  },
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
        quantity={local.quantity as number}
        isLast={false}
        {...others}
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
