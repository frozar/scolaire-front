import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Meta, StoryContext, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import LineTipComponent from "./LineTip";

function getDivFullId(options: StoryContext) {
  const name = options.name.replaceAll(" ", "-").toLowerCase();
  const mode = options.viewMode.toLowerCase();

  return `${mode}-${name}-map-container`;
}

const meta = {
  component: LineTipComponent,
  tags: ["autodocs"],
  argTypes: {
    latlng: {
      description: "The latlng of the line tip",
      control: {
        type: "object",
      },
    },
    color: {
      description: "The color of the line tip",
      control: {
        type: "color",
      },
    },
    opacity: {
      description: "The opacity of the line tip",
      control: {
        type: "number",
      },
    },
    leafletMap: {
      description: "The leaflet map",
      control: {
        type: "object",
      },
    },
  },
  decorators: [
    (Story, options) => {
      const fullId = getDivFullId(options);

      return (
        <div id={fullId} style={{ width: "100%", height: "500px" }}>
          <Story {...options.args} />
        </div>
      );
    },
  ],
} satisfies Meta<typeof LineTipComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineTipStory: Story = {
  render: (
    props: {
      latlng: L.LatLng[];
      color: string;
      opacity: number;
      leafletMap: L.Map;
    },
    options
  ) => {
    const fullId = getDivFullId(options);

    return <LineTipComponent {...props} leafletMap={initialiseMap(fullId)} />;
  },

  args: {
    latlng: [
      L.latLng(-20.9466588303741, 55.5343806753509),
      L.latLng(-20.9566588303741, 55.5443806753509),
    ],
    color: "orange",
    opacity: 1,
  },
};
