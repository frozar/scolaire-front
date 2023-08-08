//TODO Have to Mock the fetch https://storybook-addon-mock.netlify.app - first have to setup the MapId

// import { Meta, StoryObj } from "storybook-solidjs";

// import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";

// import {
//   createPoint,
//   getDivFullId,
//   mapDecorators,
// } from "../../../../../../testing/utils/TestUtils";
// import { NatureEnum } from "../../../../../type";
// import { StopPoints } from "./StopPoints";

// const meta = {
//   component: StopPoints,
//   tags: ["autodocs"],
//   decorators: mapDecorators,
// } satisfies Meta<typeof StopPoints>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const RamassagePoints: Story = {
//   render: (props: null, options) => {
//     const fullId = getDivFullId(options);

//     return (
//       <div id="map-container" style={{ width: "100%", height: "500px" }}>
//         <StopPoints
//           leafletMap={initialiseMap(fullId)}
//           items={[
//             createPoint(
//               {
//                 id: 1,
//                 leafletId: 1,
//                 lat: -20.9666588303741,
//                 lon: 55.5343806753509,
//                 name: "name",
//                 nature: NatureEnum.stop,
//               },
//               4
//             ),
//             createPoint({
//               id: 1,
//               leafletId: 1,
//               lat: -20.9466588303741,
//               lon: 55.5343806753519,
//               name: "name",
//               nature: NatureEnum.stop,
//             }),
//           ]}
//         />
//       </div>
//     );
//   },
// };
