import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";
import {
  decorators,
  getDivFullId,
} from "../../../../../../testing/utils/StoryBookUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { useStateAction } from "../../../../../StateAction";
import LineUnderConstructionComponent from "./LineUnderConstruction";

const [, { getLineUnderConstruction }] = useStateAction();

const meta = {
  component: LineUnderConstructionComponent,
  tags: ["autodocs"],
  argTypes: {
    leafletMap: {
      description: "The leaflet map",
      control: {
        type: "object",
      },
    },
  },
  decorators,
} satisfies Meta<typeof LineUnderConstructionComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineUnderConstructionStory: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <LineUnderConstructionComponent
        stops={getLineUnderConstruction().stops}
        leafletMap={initialiseMap(fullId)}
      />
    );
  },
};
