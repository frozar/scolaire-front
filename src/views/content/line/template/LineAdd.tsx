import { Match, Switch, createSignal, onMount } from "solid-js";

import { BusLineEntity, LineType } from "../../../../_entities/line.entity";

import { SchoolType } from "../../../../_entities/school.entity";
import { manageStatusCode } from "../../../../_services/_utils.service";
import { BusLineService } from "../../../../_services/line.service";
import { updatePointColor } from "../../../../leafletUtils";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import {
  setOnBoard,
  toggleDrawMod,
} from "../../board/component/template/ContextManager";
import { displayBusLine } from "../molecule/LineItem";
// TODO to fix -> doit importer un AddLineBoardContent ou similaire
import { GradeType } from "../../../../_entities/grade.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { LineStore, getLines } from "../../../../_stores/line.store";
import { getSchools } from "../../../../_stores/school.store";
import { getStops } from "../../../../_stores/stop.store";
import { AssociatedItem } from "../../board/component/molecule/CheckableElementList";
// import "./DrawTripBoard.css";
// import "../../../../../css/timeline.css";
// import "./AddLineBoardContent.css";
import { ViewManager } from "../../ViewManager";
import { SelectGradesStep } from "../organism/SelectGradesStep";
import { SelectSchoolsStep } from "../organism/SelectSchoolsStep";
import "./LineAdd.css";

//TODO enlever la partie export
export enum AddLineStep {
  start,
  schoolSelection,
  gradeSelection,
  stopSelection,
}

//TODO toDelete
export const [addLineSelectedSchool, setaddLineSelectedSchool] = createSignal<
  SchoolType[]
>([]);

//TODO toDelete
// TODO: Fix type issue => addLineCheckableStop.item has stopType properties
export const [addLineCheckableStop, setAddLineCheckableStop] = createSignal<
  AssociatedItem[]
>([]);

//TODO toDelete
export const [addLineCheckableGrade, setAddLineCheckableGrade] = createSignal<
  AssociatedItem[]
>([]);

//TODO toDelete
export const [addLineCurrentStep, setAddLineCurrentStep] =
  createSignal<AddLineStep>(AddLineStep.start);

/**
 * TODO Good code
 */
const [currentStep, setCurrentStep] = createSignal<AddLineStep>(
  AddLineStep.schoolSelection
);
const [selectedSchools, setSelectedSchools] = createSignal<SchoolType[]>([]);
const [selectedGrades, setSelectedGrades] = createSignal<GradeType[]>([]);

export function LineAdd() {
  onMount(() => {
    setSelectedSchools([]);
    setSelectedGrades([]);
    setCurrentStep(AddLineStep.schoolSelection);
  });
  // createEffect(() => {
  //   const selectedAssociated: AssociatedStopType[] = [];
  //   addLineSelectedSchool().forEach((elem) => {
  //     elem.associated.forEach((associatedValue) =>
  //       selectedAssociated.includes(associatedValue)
  //         ? ""
  //         : selectedAssociated.push(associatedValue)
  //     );
  //   });
  // });

  // if (currentLine() == undefined) {
  //   setCurrentLine(BusLineEntity.defaultBusLine());
  // }

  return (
    <div class="add-line-information-board-content">
      <Switch>
        <Match when={currentStep() == AddLineStep.schoolSelection}>
          <SelectSchoolsStep
            schools={selectedSchools()}
            nextStep={() => nextStep(AddLineStep.schoolSelection)}
            previousStep={() => previousStep(AddLineStep.schoolSelection)}
            onUpdate={onSchoolUpdate}
          />
        </Match>
        <Match when={currentStep() == AddLineStep.gradeSelection}>
          <SelectGradesStep
            schools={selectedSchools()}
            grades={selectedGrades()}
            nextStep={() => nextStep(AddLineStep.gradeSelection)}
            previousStep={() => previousStep(AddLineStep.gradeSelection)}
            onUpdate={onGradeUpdate}
          />
        </Match>
      </Switch>

      {/* 

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
              return (
                <CheckableStopListBySchool
                  school={school_elem}
                  checkableStop={addLineCheckableStop}
                  setCheckableStop={setAddLineCheckableStop}
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
            addLineCurrentStep() == AddLineStep.stopSelection
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: previousStep,
          label:
            addLineCurrentStep() === AddLineStep.schoolSelection
              ? "Annuler"
              : "Précédent",
        }}
      /> */}
    </div>
  );
}
function onGradeUpdate(grades: GradeType[]) {
  setSelectedGrades(grades);
}
function onSchoolUpdate(schools: SchoolType[]) {
  setSelectedSchools(schools);
}

function nextStep(currentStep: AddLineStep) {
  enableSpinningWheel();
  switch (currentStep) {
    case AddLineStep.schoolSelection:
      setAddLineCheckableGrade(
        selectedSchools()
          .map((school) =>
            school.grades.map((grade) => {
              return { item: grade, done: false };
            })
          )
          .flat() as AssociatedItem[]
      );
      setCurrentStep(AddLineStep.gradeSelection);
      break;
    case AddLineStep.gradeSelection:
      break;
    case AddLineStep.stopSelection:
      //TODO previos passer en param quand code passera en LineCreateOrUpdateStepper
      break;
  }
  disableSpinningWheel();
}

function previousStep(currentStep: AddLineStep) {
  enableSpinningWheel();
  switch (currentStep) {
    case AddLineStep.schoolSelection:
      //TODO previos passer en param quand code passera en LineCreateOrUpdateStepper
      ViewManager.lines();
      // ViewManager.lineDetails(Line)
      break;
    case AddLineStep.gradeSelection:
      break;
    case AddLineStep.stopSelection:
      break;
  }
  disableSpinningWheel();
}

/**
 * TODO fonctions suivantes à analyser
 */

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

async function _nextStep() {
  enableSpinningWheel();
  switch (addLineCurrentStep()) {
    case AddLineStep.schoolSelection:
      if (addLineSelectedSchool().length < 1) {
        break;
      }

      setAddLineCheckableGrade(
        getSchools()
          .map((school) =>
            school.grades.map((grade) => {
              return { item: grade, done: false };
            })
          )
          .flat() as AssociatedItem[]
      );

      setAddLineCurrentStep(AddLineStep.gradeSelection);
      break;

    case AddLineStep.gradeSelection:
      if (addLineCheckableGrade().filter((grade) => grade.done).length === 0) {
        break;
      }

      const selectedGradesId = addLineCheckableGrade()
        .filter((grade) => grade.done)
        .map((grade) => grade.item.id);

      setAddLineCheckableStop([
        ...getStops()
          .filter((stop) =>
            stop.associated.some((associatedschool) =>
              selectedGradesId.includes(associatedschool.gradeId)
            )
          )
          .map((stop) => {
            return { done: true, item: stop };
          }),
      ]);

      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        schools: addLineSelectedSchool(),
      });

      setAddLineCurrentStep(AddLineStep.stopSelection);
      break;

    case AddLineStep.stopSelection:
      if (addLineCheckableStop().length < 2) {
        // TODO: Display user message ?
        console.log("line must have at least 2 stops");
        break;
      }

      updatePointColor();

      const stops = addLineCheckableStop()
        .filter((stop) => stop.done)
        .map((stop) => stop.item) as StopType[];

      const grades = addLineCheckableGrade()
        .filter((grade) => grade.done)
        .map((grade) => grade.item) as GradeType[];

      setCurrentLine({
        ...(currentLine() ?? BusLineEntity.defaultBusLine()),
        stops,
        grades,
      });

      try {
        const creating_line = currentLine();

        if (creating_line) {
          const newBusLine: LineType = await BusLineService.create(
            creating_line
          );

          //TODO voir l'utilisation
          LineStore.set((oldLines) => [...oldLines, newBusLine]);
          setAddLineCurrentStep(AddLineStep.start);

          toggleDrawMod();
          displayBusLine(newBusLine);
          console.log("getLines", getLines());

          //TODO faire LineStore.update(newBusLine);
        }
      } catch (error) {
        console.log("error", error);
        manageStatusCode(error as Response);
      }
      setAddLineCurrentStep(AddLineStep.start);
  }
  disableSpinningWheel();
}

async function _previousStep() {
  enableSpinningWheel();
  switch (addLineCurrentStep()) {
    case AddLineStep.schoolSelection:
      setAddLineCurrentStep(AddLineStep.start);
      setaddLineSelectedSchool([]);
      setAddLineCheckableStop([]);
      toggleDrawMod();
      setOnBoard("line");
      break;
    case AddLineStep.gradeSelection:
      setAddLineCurrentStep(AddLineStep.schoolSelection);
      break;
    case AddLineStep.stopSelection:
      setAddLineCurrentStep(AddLineStep.gradeSelection);
      setAddLineCheckableStop([]);
  }
  disableSpinningWheel();
}
