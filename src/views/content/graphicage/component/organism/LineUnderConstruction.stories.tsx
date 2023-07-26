import { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Meta, StoryContext, StoryObj } from "storybook-solidjs";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { PointIdentityType } from "../../../../../type";
import PointEtablissement from "../molecule/PointEtablissement";
import PointRamassage from "../molecule/PointRamassage";
import LineUnderConstructionComponent from "./LineUnderConstruction";

function getDivFullId(options: StoryContext) {
  const name = options.name.replaceAll(" ", "-").toLowerCase();
  const mode = options.viewMode.toLowerCase();

  return `${mode}-${name}-map-container`;
}

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
  decorators: [
    (Story, options) => {
      const fullId = getDivFullId(options);

      return (
        <>
          <div id={fullId} style={{ width: "100%", height: "500px" }}>
            <PointRamassage
              quantity={6}
              minQuantity={1}
              maxQuantity={25}
              idPoint={50}
              lat={-20.9566588304741}
              lon={55.5344806754509}
              isLast={false}
              isBlinking={false}
              map={initialiseMap(fullId)}
              onIsLast={() => console.log("onIsLast")}
              onClick={() => console.log("onClick")}
              onDBLClick={(event: LeafletMouseEvent) =>
                console.log("onDBLClick, event:", event)
              }
              onMouseOver={() => console.log("onMouseOver")}
              onMouseOut={() => console.log("onMouseOut")}
            />
            <PointEtablissement
              idPoint={50}
              lat={-20.9466588303741}
              lon={55.5343806753509}
              isLast={false}
              isBlinking={false}
              map={initialiseMap(fullId)}
              onIsLast={() => console.log("onIsLast")}
              onClick={() => console.log("onClick")}
              onDBLClick={(event: LeafletMouseEvent) =>
                console.log("onDBLClick, event:", event)
              }
              onMouseOver={() => console.log("onMouseOver")}
              onMouseOut={() => console.log("onMouseOut")}
            />
            <Story {...options.args} />
          </div>
        </>
      );
    },
  ],
} satisfies Meta<typeof LineUnderConstructionComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineUnderConstructionStory: Story = {
  render: (
    props: {
      stops: PointIdentityType[];
    },
    options
  ) => {
    const fullId = getDivFullId(options);

    return (
      <LineUnderConstructionComponent
        {...props}
        leafletMap={initialiseMap(fullId)}
      />
    );
  },

  args: {
    stops: [],
  },
};
