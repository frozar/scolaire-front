import { For, Show, createEffect, createSignal } from "solid-js";

import { BusLineEntity, LineType } from "../../../../../_entities/line.entity";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";
import { ColorPicker } from "../atom/ColorPicker";

import { createStore } from "solid-js/store";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { BusLineService } from "../../../../../_services/line.service";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { setLines } from "../../../map/component/organism/BusLines";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { getStops } from "../../../map/component/organism/StopPoints";
import SelectedSchool from "../atom/SelectedSchool";
import LabeledInputField from "../molecule/LabeledInputField";
import { changeBoard } from "../template/ContextManager";
import CollapsibleCheckableElement, {
  AssociatedItem,
} from "./CollapsibleCheckableElement";
import "./DrawModeBoardContent.css";

export enum AddLineStep {
  start,
  schoolSelection,
  editLine,
}

export const [addLineSelectedSchool, setaddLineSelectedSchool] = createSignal<
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
  setaddLineSelectedSchool(getSchools()); // TODO to delete (use for primary test)
});

export const [addLineCurrentStep, setAddLineCurrentStep] =
  createSignal<AddLineStep>(AddLineStep.schoolSelection);

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

export const [creatingLine, setCreatingLine] = createSignal<LineType>(
  BusLineEntity.defaultBusLine()
);

export default function () {
  if (creatingLine() == undefined) {
    setCreatingLine(BusLineEntity.defaultBusLine());
  }

  // const etablissementsSelected = () => {
  //   return creatingLine()?.schools;
  // };

  // createEffect(() => {
  //   updateNameLineUnderConstruction(lineName());
  // });

  return (
    <div class="add-line-information-board-content">
      <Show when={addLineCurrentStep() == AddLineStep.schoolSelection}>
        <SelectedSchool schoolSelected={addLineSelectedSchool()} />
      </Show>

      <Show when={addLineCurrentStep() == AddLineStep.editLine}>
        <LabeledInputField
          label="Nom de la line"
          value={creatingLine()?.name ?? " default name"}
          onInput={(e) =>
            setCreatingLine({ ...creatingLine(), name: e.target.value })
          }
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
      </Show>
      {/* <Show when={addLineCurrentStep() == drawModeStep.editLine}>
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
          callback: nextStep,
          label:
            addLineCurrentStep() == AddLineStep.editLine
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: nextStep,
          label:
            addLineCurrentStep() === AddLineStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

async function nextStep() {
  enableSpinningWheel();
  switch (addLineCurrentStep()) {
    case AddLineStep.schoolSelection:
      if (addLineSelectedSchool().length < 1) {
        break;
      }
      setAddLineCurrentStep(AddLineStep.editLine);
      setCreatingLine({ ...creatingLine(), schools: addLineSelectedSchool() });
      break;
    case AddLineStep.editLine:
      if (stopSelected.length < 2) {
        break;
      }

      // await createOrUpdateBusCourse(getCourseUnderConstruction().course); TODO fetch la line
      // changeBoard("line-details");
      console.log(addLineSelectedSchool());

      updatePointColor();
      const stops = getStops().filter((elem) =>
        stopSelected
          .filter((elem) => elem.done)
          .map((val) => val.associated.id)
          .includes(elem.id)
      );
      setCreatingLine({ ...creatingLine(), stops });
      createBusLine(creatingLine()!);
      changeBoard("line");
  }
  disableSpinningWheel();
}

// async function createOrUpdateBusLine(line: LineType) {
//   line.setSelected(true);
//   if (line.id == undefined) {
//     await createBusLine(line);
//   } else {
//     await updateBusLine(line);
//   }
//   quitModeAddLine();
//   setCurrentStep(AddLineStep.start);
//   setDisplayLineMode((prev) =>
//     prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
//   );
//   selectedUpdatedBusLine(getLines().at(-1) as LineType);
// }

async function createBusLine(line: LineType) {
  const res: { newBusLine: LineType; bus_lines: LineType[] } =
    await BusLineService.create(line);
  setLines(res.bus_lines);
  // updateBusLines(newBusLine);
}

// async function updateBusLine(line: LineType) {
//   const updatedBusLine: LineType = await BusLineService.update(line);
//   updateBusLines(updatedBusLine);
// }
