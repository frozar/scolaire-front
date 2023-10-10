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
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { getStops } from "../../../map/component/organism/StopPoints";
import { displayBusLine } from "../../../schools/component/molecule/BusLineItem";
import SelectedSchool from "../atom/SelectedSchool";
import LabeledInputField from "../molecule/LabeledInputField";
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

export const [addLineCurrentStep, setAddLineCurrentStep] =
  createSignal<AddLineStep>(AddLineStep.schoolSelection);

// eslint-disable-next-line solid/reactivity
export default function () {
  createEffect(() => {
    const selectedAssociated: AssociatedPointType[] = [];
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

      <Show when={addLineCurrentStep() == AddLineStep.editLine}>
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
      setAddLineCurrentStep(AddLineStep.editLine);
      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        schools: addLineSelectedSchool(),
      });
      break;
    case AddLineStep.editLine:
      if (stopSelected.length < 2) {
        break;
      }

      updatePointColor();
      const stops = getStops().filter((elem) =>
        stopSelected
          .filter((elem) => elem.done)
          .map((val) => val.associated.id)
          .includes(elem.id)
      );
      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        stops,
      });
      await createBusLine(currentLine());
  }
  disableSpinningWheel();
}

async function createBusLine(line: LineType | undefined) {
  if (line) {
    const newBusLine: LineType = await BusLineService.create(line);
    displayBusLine(newBusLine);
  }
  // updateBusLines(newBusLine);
}

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