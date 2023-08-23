import "leaflet/dist/leaflet.css";

import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import { LeafletMouseEvent } from "leaflet";
import { splitProps } from "solid-js";
import {
  createPoint,
  getDivFullId,
  mapDecorators,
} from "../../../../../../testing/utils/TestUtils";
import PointComponent from "./Point";

const meta = {
  component: PointComponent,
  tags: ["autodocs"],
  decorators: mapDecorators,
  argTypes: {
    onClick: () => console.log("onClick"),
    onDBLClick: (event: LeafletMouseEvent) =>
      console.log("onDBLClick, event:", event),
    onMouseOver: () => console.log("onMouseOver"),
    onMouseOut: () => console.log("onMouseOut"),
    onMouseUp: () => console.log("onMouseUp"),
  },
} satisfies Meta<typeof PointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export interface PointStorybook {
  fillColor?: string;
  borderColor?: string;
  maxQuantity?: number;
  minQuantity?: number;
  quantity?: number;

  radius: number;
  weight: number;
  isBlinking: false;

  onClick: () => void;
  onIsLast: () => void;
  onDBLClick: () => void;
  onMouseOut: () => void;
  onMouseOver: () => void;
  onMouseUp: () => void;
}

export const PointStories: Story = {
  render: (props: PointStorybook, options) => {
    const fullId = getDivFullId(options);
    const [local, others] = splitProps(props, ["fillColor", "borderColor"]);

    return (
      <PointComponent
        point={createPoint({
          id: 1,
          idPoint: 50,
          lat: -20.9466588303741,
          lon: 55.5343806753509,
          name: "name",
          quantity: 5,
        })}
        map={initialiseMap(fullId)}
        {...others}
        borderColor={local.borderColor as string}
        fillColor={local.fillColor as string}
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

export const PointStories2: Story = {
  render: (props: PointStorybook, options) => {
    const fullId = getDivFullId(options);
    const [local, others] = splitProps(props, ["fillColor", "borderColor"]);

    return (
      <PointComponent
        point={createPoint({
          id: 1,
          idPoint: 50,
          lat: -20.9466588303741,
          lon: 55.5343806753519,
          name: "name",
          quantity: 5,
        })}
        map={initialiseMap(fullId)}
        {...others}
        borderColor={local.borderColor as string}
        fillColor={local.fillColor as string}
        // TODO: Use argtypes as the first story do
        onClick={() => console.log("onClick")}
        onDBLClick={() => console.log("onDBLClick")}
        onMouseOut={() => console.log("onMouseOut")}
        onMouseOver={() => console.log("onMouseOver")}
        onMouseUp={() => console.log("onMouseUp")}
      />
    );
  },

  args: {
    isBlinking: false,
    weight: 4,
    radius: 12,
    borderColor: "green",
    fillColor: "white",
  },
};
