import { Match, Switch, createSignal, onMount } from "solid-js";

import { BusLineEntity, LineType } from "../../../../_entities/line.entity";

import { SchoolType } from "../../../../_entities/school.entity";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
// TODO to fix -> doit importer un AddLineBoardContent ou similaire
import { GradeType } from "../../../../_entities/grade.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getStops } from "../../../../_stores/stop.store";
// import "./DrawTripBoard.css";
// import "../../../../../css/timeline.css";
// import "./AddLineBoardContent.css";
import { ViewManager } from "../../ViewManager";
import { ColorPicker } from "../../board/component/atom/ColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { SelectGradesStep } from "../organism/SelectGradesStep";
import { SelectSchoolsStep } from "../organism/SelectSchoolsStep";
import { SelectStopsStep } from "../organism/SelectStopsStep";
import "./LineAdd.css";

//TODO enlever la partie export
export enum AddLineStep {
  start,
  schoolSelection,
  gradeSelection,
  stopSelection,
}

export const [currentLine, setCurrentLine] = createSignal<LineType>(
  BusLineEntity.defaultBusLine()
);
const [currentStep, setCurrentStep] = createSignal<AddLineStep>(
  AddLineStep.schoolSelection
);
const [selectedSchools, setSelectedSchools] = createSignal<SchoolType[]>([]);
const [selectedGrades, setSelectedGrades] = createSignal<GradeType[]>([]);

export function LineAdd() {
  onMount(() => {
    setCurrentLine(BusLineEntity.defaultBusLine());
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
            schools={currentLine().schools}
            nextStep={() => nextStep(AddLineStep.schoolSelection)}
            previousStep={() => previousStep(AddLineStep.schoolSelection)}
            onUpdate={onSchoolUpdate}
          />
        </Match>
        <Match when={currentStep() == AddLineStep.gradeSelection}>
          <SelectGradesStep
            schools={currentLine().schools}
            grades={currentLine().grades}
            nextStep={() => nextStep(AddLineStep.gradeSelection)}
            previousStep={() => previousStep(AddLineStep.gradeSelection)}
            onUpdate={onGradeUpdate}
          />
        </Match>
        <Match when={currentStep() == AddLineStep.stopSelection}>
          <LabeledInputField
            label="Nom de la ligne"
            value={currentLine()?.name ?? "default name"}
            onInput={(e) =>
              setCurrentLine((line) => {
                return { ...line, name: e.target.value };
              })
            }
            name="line-name"
            placeholder="Entrer le nom de la line"
          />

          <div class="flex mt-4 justify-between">
            <ColorPicker
              defaultColor={currentLine()?.color()}
              title="Couleur de la ligne"
              onInput={onColorUpdate}
              onChange={onColorUpdate}
            />
          </div>

          <SelectStopsStep
            grades={currentLine().grades}
            stops={currentLine().stops}
            nextStep={() => nextStep(AddLineStep.stopSelection)}
            previousStep={() => previousStep(AddLineStep.stopSelection)}
            onUpdate={onStopsUpdate}
          />
        </Match>
      </Switch>
    </div>
  );
}
function onColorUpdate(color: string) {
  currentLine().setColor(color);
}
function onGradeUpdate(grades: GradeType[]) {
  setCurrentLine((line) => {
    return { ...line, grades: grades };
  });
}
function onSchoolUpdate(schools: SchoolType[]) {
  setCurrentLine((line) => {
    return { ...line, schools: schools };
  });
}
function onStopsUpdate(stops: StopType[]) {
  setCurrentLine((line) => {
    return { ...line, stops: stops };
  });
}

function setStopsFromGradeSelection() {
  const selectedGradesId = currentLine().grades.map((grade) => grade.id);

  const stops = [
    ...getStops().filter((stop) =>
      stop.associated.some((associatedschool) =>
        selectedGradesId.includes(associatedschool.gradeId)
      )
    ),
  ];
  onStopsUpdate(stops);
}

function nextStep(currentStep: AddLineStep) {
  enableSpinningWheel();
  switch (currentStep) {
    case AddLineStep.schoolSelection:
      setCurrentStep(AddLineStep.gradeSelection);
      break;
    case AddLineStep.gradeSelection:
      setStopsFromGradeSelection();
      setCurrentStep(AddLineStep.stopSelection);
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
      setCurrentStep(AddLineStep.schoolSelection);
      break;
    case AddLineStep.stopSelection:
      break;
  }
  disableSpinningWheel();
}

/**
 * TODO fonctions suivantes à analyser
 */

async function _nextStep() {
  enableSpinningWheel();
  // switch (addLineCurrentStep()) {

  // case AddLineStep.stopSelection:
  // if (addLineCheckableStop().length < 2) {
  //   // TODO: Display user message ?
  //   console.log("line must have at least 2 stops");
  //   break;
  // }

  // updatePointColor();

  // const stops = addLineCheckableStop()
  //   .filter((stop) => stop.done)
  //   .map((stop) => stop.item) as StopType[];

  // const grades = addLineCheckableGrade()
  //   .filter((grade) => grade.done)
  //   .map((grade) => grade.item) as GradeType[];

  // setCurrentLine({
  //   ...(currentLine() ?? BusLineEntity.defaultBusLine()),
  //   stops,
  //   grades,
  // });

  // try {
  //   const creating_line = currentLine();

  //   if (creating_line) {
  //     const newBusLine: LineType = await BusLineService.create(
  //       creating_line
  //     );

  //     //TODO voir l'utilisation
  //     LineStore.set((oldLines) => [...oldLines, newBusLine]);
  //     setAddLineCurrentStep(AddLineStep.start);

  //     toggleDrawMod();
  //     displayBusLine(newBusLine);
  //     console.log("getLines", getLines());

  //     //TODO faire LineStore.update(newBusLine);
  //   }
  // } catch (error) {
  //   console.log("error", error);
  //   manageStatusCode(error as Response);
  // }
  // setAddLineCurrentStep(AddLineStep.start);
  // }
  disableSpinningWheel();
}

async function _previousStep() {
  enableSpinningWheel();
  // switch (addLineCurrentStep()) {
  //   case AddLineStep.gradeSelection:
  //     setAddLineCurrentStep(AddLineStep.schoolSelection);
  //     break;
  //   case AddLineStep.stopSelection:
  //     setAddLineCurrentStep(AddLineStep.gradeSelection);
  //     setAddLineCheckableStop([]);
  // }
  disableSpinningWheel();
}
