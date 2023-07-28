import "leaflet/dist/leaflet.css";
import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import {
  Mapdecorators,
  createPoint,
  getDivFullId,
} from "../../../../../../testing/utils/TestUtils";
import { initialiseMap } from "../../../../../../testing/utils/mapWrapper";
import { EleveVersEtablissementType } from "../../../../../type";
import { PointInterface } from "../atom/Point";
import PointsComponent from "./Points";

const meta = {
  component: PointsComponent,
  tags: ["autodocs"],
  decorators: Mapdecorators,
} satisfies Meta<typeof PointsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [schoolPoints, setSchoolPoints] = createSignal<PointInterface[]>([
  createPoint({
    id: 1,
    idPoint: 1,
    lat: -20.9666588303741,
    lon: 55.5343806753509,
    name: "name",
    quantity: 5,
  }),
  createPoint({
    id: 2,
    idPoint: 2,
    lat: -20.9466588303741,
    lon: 55.5343806753519,
    name: "name",
    quantity: 5,
  }),
]);

const [stopPoints, setStopPoints] = createSignal<PointInterface[]>([
  createPoint({
    id: 1,
    idPoint: 1,
    lat: -20.9666588303741,
    lon: 55.5443806753509,
    name: "name",
    quantity: 5,
  }),
  createPoint({
    id: 2,
    idPoint: 2,
    lat: -20.9366588303741,
    lon: 55.5343806753519,
    name: "name",
    quantity: 5,
  }),
]);
const [studentToSchool, setStudentToSchool] = createSignal<
  EleveVersEtablissementType[]
>([
  {
    id: 1,
    quantity: 4,
    ramassage_id: 1,
    etablissement_id: 1,
    etablissement_id_point: 1,
    ramassage_id_point: 1,
    etablissement: "Ecole DE BEAUMONT",
    ramassage: "VIERGE BLANCHE",
  },
  {
    id: 2,
    quantity: 5,
    ramassage_id: 2,
    etablissement_id: 2,
    etablissement_id_point: 2,
    ramassage_id_point: 2,
    etablissement: "Ecole DE BEAUMONT",
    ramassage: "TALIPOT",
  },
]);

export const Points: Story = {
  render: (props: null, options) => {
    const fullId = getDivFullId(options);

    return (
      <PointsComponent
        map={initialiseMap(fullId)}
        mapId={2}
        schoolItems={{ items: schoolPoints, set: setSchoolPoints }}
        stopItems={{ items: stopPoints, set: setStopPoints }}
        studentsToSchool={{ items: studentToSchool, set: setStudentToSchool }}
      />
    );
  },
};
