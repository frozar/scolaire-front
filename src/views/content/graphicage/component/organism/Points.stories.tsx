//TODO Have to Mock the fetch https://storybook-addon-mock.netlify.app - first have to setup the MapId
// import "leaflet/dist/leaflet.css";
// import { Meta, StoryObj } from "storybook-solidjs";

// import {
//   getDivFullId,
//   mapDecorators,
// } from "../../../../../../testing/utils/TestUtils";
// import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
// import { Points } from "./Points";

// const meta = {
//   component: Points,
//   tags: ["autodocs"],
//   decorators: mapDecorators,
// } satisfies Meta<typeof Points>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const PointsStory: Story = {
//   render: (props: null, options) => {
//     const fullId = getDivFullId(options);
//     // TODO WARNING testMapId depends of local database.
//     // Mock data to fetch
//     return <Points leafletMap={initialiseMap(fullId)} />;
//   },
// };
