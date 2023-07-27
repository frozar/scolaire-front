import "leaflet/dist/leaflet.css";

import { Meta, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  Mapdecorators,
  createPoint,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import PointComponent from "./Point";

const meta = {
  component: PointComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
} satisfies Meta<typeof PointComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointStories: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

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
        isBlinking={false}
        weight={4}
        radius={8}
        borderColor="red"
        fillColor="white"
        onClick={() => console.log("onClick")}
        onIsLast={() => console.log("onIsLast")}
        onDBLClick={() => console.log("onDBLClick")}
        onMouseOut={() => console.log("onMouseOut")}
        onMouseOver={() => console.log("onMouseOvre")}
        isLast={false}
      />
    );
  },
};

export const PointStories2: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

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
        isBlinking={false}
        weight={4}
        radius={12}
        borderColor="green"
        fillColor="white"
        onClick={() => console.log("onClick")}
        onIsLast={() => console.log("onIsLast")}
        onDBLClick={() => console.log("onDBLClick")}
        onMouseOut={() => console.log("onMouseOut")}
        onMouseOver={() => console.log("onMouseOvre")}
        isLast={false}
      />
    );
  },
};
