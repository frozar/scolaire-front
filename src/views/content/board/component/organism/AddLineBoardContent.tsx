import { For, Show, createEffect, createSignal } from "solid-js";

import { LineType } from "../../../../../_entities/line.entity";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";
import { ColorPicker } from "../atom/ColorPicker";

import { createStore } from "solid-js/store";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import LabeledInputField from "../molecule/LabeledInputField";
import CollapsibleCheckableElement, {
  AssociatedItem,
} from "./CollapsibleCheckableElement";
import "./DrawModeBoardContent.css";

export enum drawModeStep {
  start,
  schoolSelection,
  editLine,
}

export const [addLineSelectedSchool, setaddLineSelectedShcool] = createSignal<
  SchoolType[]
>([]);
const [stopSelected, setStopSelected] = createStore<AssociatedItem[]>([]);

createEffect(() => {
  const selectedAssociated: AssociatedPointType[] = [];
  addLineSelectedSchool().forEach((elem) => {
    elem.associated.forEach((associatedValue) =>
      selectedAssociated.includes(associatedValue)
        ? ""
        : selectedAssociated.push(associatedValue)
    );
  });
  // setStopSelected(
  //   addLineSelectedSchool().map((elem) => {
  //     return { associated: elem, done: true };
  //   })
  // );
});

createEffect(() => {
  setaddLineSelectedShcool(getSchools()); //TODO to delete (use for primary test)
});
export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

export enum displayLineModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

const setColorOnLine = (color: string): LineType | undefined => {
  const line: LineType | undefined = creatingLine();

  if (!line) return;

  line.setColor(color);

  return line;
};

const onInput = (color: string) => {
  const line: LineType | undefined = setColorOnLine(color);

  if (!line) return;
};

const onChange = async (color: string) => {
  const line: LineType | undefined = setColorOnLine(color);

  if (!line) return;
};

async function onClick() {
  // if (displayLineMode() == displayLineModeEnum.straight) {
  //   if (creatingLine().line.points.length < 2) {
  //     return;
  //   }
  //   if (!creatingLine().line.waypoints) {
  //     const waypoints = WaypointEntity.createWaypointsFromPoints(
  //       creatingLine().line
  //     );
  //     setLineUnderConstruction({
  //       ...creatingLine(),
  //       line: {
  //         ...creatingLine().line,
  //         waypoints,
  //       },
  //     });
  //   }
  //   await updatePolylineWithOsrm(creatingLine().line);

  //   setDisplayLineMode(displayLineModeEnum.onRoad);
  // } else if (displayLineMode() == displayLineModeEnum.onRoad) {
  //   creatingLine().line.setLatLngs([]);

  //   setDisplayLineMode(displayLineModeEnum.straight);
  // }
  console.log(" line");
}

export const [displayLineMode, setDisplayLineMode] =
  createSignal<displayLineModeEnum>(displayLineModeEnum.straight);

export const [creatingLine, setCreatingLine] = createSignal<
  LineType | undefined
>();

export default function () {
  const [lineName, setLineName] = createSignal<string>(
    creatingLine()?.name ?? creatingLine()?.schools[0].name ?? "default name"
  );

  // const etablissementsSelected = () => {
  //   return creatingLine()?.schools;
  // };

  // createEffect(() => {
  //   updateNameLineUnderConstruction(lineName());
  // });

  return (
    <div class="add-line-information-board-content">
      <Show when={true}>
        <LabeledInputField
          label="Nom de la line"
          value={lineName()}
          onInput={(e) => setLineName(e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la line"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={creatingLine()?.color()}
            title="Couleur de la ligne"
            onInput={onInput}
            onChange={onChange}
          />
        </div>
      </Show>

      <fieldset>
        <For each={addLineSelectedSchool()}>
          {(school_elem) => {
            return (
              <CollapsibleCheckableElement
                school={school_elem}
                stopSelected={stopSelected}
                setStopSelected={setStopSelected}
              />
            );
          }}
        </For>
      </fieldset>
      {/* <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content">
          <Show
            when={creatingLine().line.points.length > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
              </div>
            }
          >
            <Timeline />
          </Show>
        </div>
      </Show> */}

      <BoardFooterActions
        nextStep={{
          callback: () => console.log("valider"),
          label: "Valider",
        }}
        previousStep={{
          callback: () => console.log("Annuler"),
          label: "Annuler",
        }}
      />
    </div>
  );
}
// async function createOrUpdateBusLine(line: LineType) {
//   line.setSelected(true);
//   if (line.id == undefined) {
//     await createBusLine(line);
//   } else {
//     await updateBusLine(line);
//   }
//   quitModeAddLine();
//   setCurrentStep(drawModeStep.start);
//   setDisplayLineMode((prev) =>
//     prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
//   );
//   selectedUpdatedBusLine(getLines().at(-1) as LineType);
// }

// async function createBusLine(line: LineType) {
//   const newBusLine: LineType = await BusLineService.create(line);
//   updateBusLines(newBusLine);
// }

// async function updateBusLine(line: LineType) {
//   const updatedBusLine: LineType = await BusLineService.update(line);
//   updateBusLines(updatedBusLine);
// }
