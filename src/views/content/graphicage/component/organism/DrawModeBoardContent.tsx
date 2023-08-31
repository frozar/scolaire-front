import { Show, createEffect, createSignal } from "solid-js";
import {
  defaultLineUnderConstruction,
  useStateAction,
} from "../../../../../StateAction";

import SelectedSchool from "../atom/SelectedSchool";

import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { BusLineService } from "../../../../../_services/bus-line.service";

import { quitModeAddLine } from "../../shortcut";
import { updateBusLines } from "./BusLines";
import DrawModeBoardContentFooter from "./DrawModeBoardContentFooter";

import "../../../../../css/timeline.css";
import { LineUnderConstructionType } from "../../../../../type";
import Timeline from "../../informationBoard/Timeline";
import ButtonIcon from "../../informationBoard/components/molecul/ButtonIcon";
import LabeledInputField from "../../informationBoard/components/molecul/LabeledInputField";
import SchoolsEnumeration from "../../informationBoard/components/molecul/SchoolsEnumeration";
import Metrics from "../../informationBoard/components/organisme/Metrics";
import CurvedLine from "../../informationBoard/components/svg-icons/CurvedLine";
import SimpleLine from "../../informationBoard/components/svg-icons/SimpleLine";
import { ColorPicker } from "../atom/ColorPicker";
import { DrawHelperButton } from "../atom/DrawHelperButton";

const [
  ,
  {
    getLineUnderConstruction,
    setLineUnderConstruction,
    updateNameLineUnderConstruction,
  },
] = useStateAction();

export enum drawModeStep {
  start,
  schoolSelection,
  editLine,
}

export const [currentStep, setCurrentStep] = createSignal<drawModeStep>(
  drawModeStep.start
);

export enum displayLineModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

const setColorOnLine = (color: string): BusLineType | undefined => {
  const line: LineUnderConstructionType | undefined =
    getLineUnderConstruction();

  if (!line) return;

  line.busLine.setColor(color);

  return line.busLine;
};

const onInput = (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);

  if (!line) return;
};

const onChange = async (color: string) => {
  const line: BusLineType | undefined = setColorOnLine(color);

  if (!line) return;

  // TODO Patch the Line Bus Color

  const updatedLine: BusLineType = await BusLineService.update({
    id: line.id,

    color: line.color,

    latLngs: line.latLngs,
  });

  console.log(updatedLine);
};

async function onClick() {
  if (displayLineMode() == displayLineModeEnum.straight) {
    if (getLineUnderConstruction().busLine.points.length < 2) {
      return;
    }

    await updatePolylineWithOsrm(getLineUnderConstruction().busLine);

    setDisplayLineMode(displayLineModeEnum.onRoad);

    // ! Changement de drawModeStep
  } else if (displayLineMode() == displayLineModeEnum.onRoad) {
    getLineUnderConstruction().busLine.setLatLngs([]);

    setDisplayLineMode(displayLineModeEnum.straight);

    // ! Changement de drawModeStep
  }
}

export const [displayLineMode, setDisplayLineMode] =
  createSignal<displayLineModeEnum>(displayLineModeEnum.straight);

export default function () {
  const [lineName, setLineName] = createSignal<string>(
    getLineUnderConstruction().busLine.name ??
      getLineUnderConstruction().busLine.schools[0].name
  );

  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  createEffect(() => {
    updateNameLineUnderConstruction(lineName());
  });

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == drawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={etablissementSelected()} />
      </Show>

      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={getLineUnderConstruction().busLine.schools.map(
              (school) => school.name
            )}
          />
          <Show when={getLineUnderConstruction().busLine.points.length > 0}>
            <DrawHelperButton
              schools={getLineUnderConstruction().busLine.schools}
            />
          </Show>
        </div>
        <Metrics line={getLineUnderConstruction().busLine} />
        <LabeledInputField
          value={lineName()}
          onInput={(e) => setLineName(e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la ligne"
        />

        <div class="flex mt-4 justify-between">
          <ColorPicker
            defaultColor={getLineUnderConstruction().busLine.color()}
            title="Couleur de la ligne"
            onInput={onInput}
            onChange={onChange}
          />

          <Show
            when={displayLineMode() == displayLineModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleLine />}
                onClick={onClick}
                class="mr-2"
              />
            }
          >
            <ButtonIcon icon={<CurvedLine />} onClick={onClick} class="mr-2" />
          </Show>
        </div>
      </Show>

      <Show when={currentStep() == drawModeStep.editLine}>
        <div class="bus-line-information-board-content">
          <Show
            when={getLineUnderConstruction().busLine.points.length > 0}
            fallback={
              <div class="flex w-4/5 justify-center absolute bottom-[120px]">
                Veuillez sélectionner des arrêts sur la carte
              </div>
            }
          >
            <Timeline />
          </Show>
        </div>
      </Show>

      <DrawModeBoardContentFooter
        nextStep={{
          callback: nextStep,
          label: currentStep() == drawModeStep.editLine ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === drawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

// TODO after creating line set it as selected and show the timeline in the information board in read mod
async function createOrUpdateBusLine(busLine: BusLineType) {
  busLine.setSelected(true);
  if (busLine.id == undefined) {
    await createBusLine(busLine);
  } else {
    await updateBusLine(busLine);
  }
  quitModeAddLine();
  setCurrentStep(drawModeStep.start);
}

async function createBusLine(busLine: BusLineType) {
  const newBusLine: BusLineType = await BusLineService.create(busLine);
  updateBusLines(newBusLine);
}

async function updateBusLine(busLine: BusLineType) {
  const updatedBusLine: BusLineType = await BusLineService.update(busLine);
  updateBusLines(updatedBusLine);
}

async function nextStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      if (getLineUnderConstruction().busLine.schools.length < 1) {
        break;
      }
      setCurrentStep(drawModeStep.editLine);
    case drawModeStep.editLine:
      if (getLineUnderConstruction().busLine.points.length < 2) {
        break;
      }
      if (displayLineMode() == displayLineModeEnum.straight) {
        await updatePolylineWithOsrm(getLineUnderConstruction().busLine);
      }

      createOrUpdateBusLine(getLineUnderConstruction().busLine);
  }
}

function prevStep() {
  switch (currentStep()) {
    case drawModeStep.schoolSelection:
      setLineUnderConstruction(defaultLineUnderConstruction());
      quitModeAddLine();

      setCurrentStep(drawModeStep.start);
      break;
    case drawModeStep.editLine:
      setLineUnderConstruction(defaultLineUnderConstruction());

      if (displayLineMode() == displayLineModeEnum.onRoad) {
        getLineUnderConstruction().busLine.setLatLngs([]);
      }

      setCurrentStep(drawModeStep.schoolSelection);
      break;
  }
  setDisplayLineMode((prev) =>
    prev == displayLineModeEnum.straight ? prev : displayLineModeEnum.straight
  );
}
