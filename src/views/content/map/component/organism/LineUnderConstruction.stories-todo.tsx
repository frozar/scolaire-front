//TODO Have to Mock the fetch https://storybook-addon-mock.netlify.app - first have to setup the MapId
// import "leaflet/dist/leaflet.css";
// import { Meta, StoryObj } from "storybook-solidjs";
// import {
//   decorators,
//   getDivFullId,
// } from "../../../../../../testing/utils/TestUtils";
// import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
// import { useStateAction } from "../../../../../StateAction";
// import CourseUnderConstructionComponent from "./CourseUnderConstruction";

// const [
//   ,
//   { getCourseUnderConstruction, setModeAddCourse, confirmEtablissementSelection },
// ] = useStateAction();

// setModeAddCourse();
// confirmEtablissementSelection();

// const meta = {
//   component: CourseUnderConstructionComponent,
//   tags: ["autodocs"],
//   argTypes: {
//     leafletMap: {
//       description: "The leaflet map",
//       control: {
//         type: "object",
//       },
//     },
//   },
//   decorators,
// } satisfies Meta<typeof CourseUnderConstructionComponent>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const CourseUnderConstructionStory: Story = {
//   render: (props: null, options) => {
//     const fullId = getDivFullId(options);

//     return (
//       <CourseUnderConstructionComponent
//         stops={getCourseUnderConstruction().stops}
//         leafletMap={initialiseMap(fullId)}
//       />
//     );
//   },
// };
