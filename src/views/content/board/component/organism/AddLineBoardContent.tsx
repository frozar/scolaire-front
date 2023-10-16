import { For, Show, createEffect, createSignal } from "solid-js";

import { BusLineEntity, LineType } from "../../../../../_entities/line.entity";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";
import { ColorPicker } from "../atom/ColorPicker";

import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { manageStatusCode } from "../../../../../_services/_utils.service";
import { BusLineService } from "../../../../../_services/line.service";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { getStops } from "../../../map/component/organism/StopPoints";
import { displayBusLine } from "../../../schools/component/molecule/BusLineItem";
import SelectedSchool from "../atom/SelectedSchool";
import LabeledInputField from "../molecule/LabeledInputField";
import { setOnBoard, toggleDrawMod } from "../template/ContextManager";
import "./AddLineBoardContent.css";
import CollapsibleCheckableElement, {
  AssociatedItem,
} from "./CollapsibleCheckableElement";
// TODO to fix -> doit importer un AddLineBoardContent ou similaire
import "./DrawRaceBoard.css";

export enum AddLineStep {
  start,
  schoolSelection,
  stopSelection,
}

export const [addLineSelectedSchool, setaddLineSelectedSchool] = createSignal<
  SchoolType[]
>([]);

export const [stopSelected, setStopSelected] = createSignal<AssociatedItem[]>(
  []
);

export const [addLineCurrentStep, setAddLineCurrentStep] =
  createSignal<AddLineStep>(AddLineStep.start);

// eslint-disable-next-line solid/reactivity
export default function () {
  createEffect(() => {
    const selectedAssociated: AssociatedSchoolType[] = [];
    addLineSelectedSchool().forEach((elem) => {
      elem.associated.forEach((associatedValue) =>
        selectedAssociated.includes(associatedValue)
          ? ""
          : selectedAssociated.push(associatedValue)
      );
    });
  });

  createEffect(() => {
    setaddLineSelectedSchool(getSchools()); // TODO to delete (use for primary test) rendre les écoles clickables
  });

  if (currentLine() == undefined) {
    setCurrentLine(BusLineEntity.defaultBusLine());
  }

  return (
    <div class="add-line-information-board-content">
      <Show when={addLineCurrentStep() == AddLineStep.schoolSelection}>
        <SelectedSchool schoolSelected={addLineSelectedSchool()} />
      </Show>

      <Show when={addLineCurrentStep() == AddLineStep.stopSelection}>
        <LabeledInputField
          label="Nom de la line"
          value={currentLine()?.name ?? " default name"}
          onInput={(e) =>
            setCurrentLine({
              ...(currentLine() ?? BusLineEntity.defaultBusLine()),
              name: e.target.value,
            })
          }
          name="line-name"
          placeholder="Entrer le nom de la line"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={currentLine()?.color()}
            title="Couleur de la ligne"
            onInput={onInput}
            onChange={onChange}
          />
        </div>

        <fieldset class="line-stop-selection">
          <For each={addLineSelectedSchool()}>
            {(school_elem) => {
              return <CollapsibleCheckableElement school={school_elem} />;
            }}
          </For>
        </fieldset>
      </Show>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label:
            addLineCurrentStep() == AddLineStep.stopSelection
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: previousStep,
          label:
            addLineCurrentStep() === AddLineStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

//TODO Externaliser les fonctions ci dessous

const setColorOnLine = (color: string): LineType | undefined => {
  const line: LineType | undefined = currentLine();

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

export const [currentLine, setCurrentLine] = createSignal<LineType>();

async function nextStep() {
  enableSpinningWheel();
  switch (addLineCurrentStep()) {
    case AddLineStep.schoolSelection:
      if (addLineSelectedSchool().length < 1) {
        break;
      }

      setStopSelected([
        ...getStops().map((stop) => {
          return { done: false, associated: stop };
        }),
      ]);

      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        schools: addLineSelectedSchool(),
      });

      setAddLineCurrentStep(AddLineStep.stopSelection);
      break;

    case AddLineStep.stopSelection:
      if (stopSelected().length < 2) {
        break;
      }

      updatePointColor();

      const stops = stopSelected()
        .filter((stop) => stop.done)
        .map((stop) => stop.associated);
      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        stops,
      });

      try {
        const creating_line = currentLine();

        if (creating_line) {
          const newBusLine: LineType = await BusLineService.create(
            creating_line
          );
          setAddLineCurrentStep(AddLineStep.start);

          toggleDrawMod();
          displayBusLine(newBusLine);

          //TODO faire updateBusLines(newBusLine);
        }
      } catch (error) {
        console.log("error", error);
        manageStatusCode(error as Response);
      }
      setAddLineCurrentStep(AddLineStep.start);
  }
  disableSpinningWheel();
}

async function previousStep() {
  enableSpinningWheel();
  switch (addLineCurrentStep()) {
    case AddLineStep.schoolSelection:
      setAddLineCurrentStep(AddLineStep.start);
      setaddLineSelectedSchool([]);
      setStopSelected([]);
      toggleDrawMod();
      setOnBoard("line");
      break;
    case AddLineStep.stopSelection:
      setAddLineCurrentStep(AddLineStep.schoolSelection);
      setStopSelected([]);
  }
  disableSpinningWheel();
}

// async function createBusLine(line: LineType | undefined) {
//   if (line) {
//     const newBusLine: LineType = await BusLineService.create(line);
//     return
//     displayBusLine(newBusLine);
//   }

// }

// async function updateBusLine(line: LineType) {
//   const updatedBusLine: LineType = await BusLineService.update(line);
//   updateBusLines(updatedBusLine);
// }

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
