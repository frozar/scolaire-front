import { Meta, StoryObj } from "storybook-solidjs";

import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

import {
  Mapdecorators,
  createPoint,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import PointRamassageComponent from "./PointRamassage";

const meta = {
  component: PointRamassageComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
} satisfies Meta<typeof PointRamassageComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PointRamassage: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <PointRamassageComponent
        point={createPoint(
          1,
          50,
          -20.9466588303741,
          55.5343806753509,
          "name",
          5
        )}
        map={initialiseMap(fullId)}
        onClick={() => console.log("onClick")}
        onIsLast={() => console.log("onIsLast")}
        onDBLClick={() => console.log("onDBLClick")}
        onMouseOut={() => console.log("onMouseOut")}
        onMouseOver={() => console.log("onMouseOvre")}
        isLast={false}
        maxQuantity={25}
        minQuantity={1}
        quantity={6}
      />
    );
  },
};
