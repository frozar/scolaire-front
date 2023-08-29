import { For, Show, createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { BusLineService } from "../../../../_services/bus-line.service";
import { LineUnderConstructionType } from "../../../../type";
import { ColorPicker } from "../component/atom/ColorPicker";
import { DrawHelperButton } from "../component/atom/DrawHelperButton";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";
import {
  displayLineMode,
  displayLineModeEnum,
  setDisplayLineMode,
} from "../component/organism/DrawModeBoardContent";
import ButtonIcon from "./components/molecul/ButtonIcon";
import LabeledInputField from "./components/molecul/LabeledInputField";
import SchoolsEnumeration from "./components/molecul/SchoolsEnumeration";
import CurvedLine from "./components/svg-icons/CurvedLine";
import SimpleLine from "./components/svg-icons/SimpleLine";
const [, { isInAddLineMode, getLineUnderConstruction }] = useStateAction();

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

const setColorOnLine = (color: string): BusLineType | undefined => {
  const line: LineUnderConstructionType | undefined =
    getLineUnderConstruction();
  if (!line) return;
  line.busLine.setColor(color);
  return line.busLine;
};

export default function (props: {
  //TODO pas utile de les passer en paramètre ce sont des signaux
  line: () => LineUnderConstructionType;
  setLine: (line: LineUnderConstructionType) => void;
  schools: SchoolType[];
}) {
  const [lineName, setLineName] = createSignal<string>("");

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

  return (
    <section>
      <SchoolsEnumeration
        schoolsName={props.schools.map((school) => school.name)}
      />

      <LabeledInputField
        value={lineName()}
        onInput={(e) => setLineName(e.target.value)}
        name="line-name"
        placeholder="Entrer le nom de la ligne"
      />

      <div class="flex mt-4 justify-between">
        <ColorPicker
          title="Couleur de la ligne"
          onInput={onInput}
          onChange={onChange}
        />

        <Show
          when={displayLineMode() == displayLineModeEnum.straight}
          fallback={
            <ButtonIcon icon={<SimpleLine />} onClick={onClick} class="mr-2" />
          }
        >
          <ButtonIcon icon={<CurvedLine />} onClick={onClick} class="mr-2" />
        </Show>
      </div>

      <Show
        when={getLineUnderConstruction().busLine.points.length > 0}
        fallback={
          <div class="flex justify-center absolute bottom-40 mx-auto w-[90%]">
            Veuillez séléctionner des point sur la carte
          </div>
        }
      >
        <div class="timeline">
          <div class="timeline-tools">
            <Show when={props.line().busLine.points.length > 0}>
              <DrawHelperButton schools={props.line().busLine.schools} />
            </Show>
          </div>
          <div
            class="timeline-items v-timeline--side-end v-timeline--vertical"
            style={{ "--v-timeline-line-thickness": "2px" }}
          >
            <For each={props.line()?.busLine.points}>
              {(stop, i) => (
                <>
                  <TimelineAddPointButton indice={i()} />

                  <TimelineItemAddMode
                    pointsResource={stop}
                    indice={i()}
                    setter={props.setLine}
                    getter={props.line}
                    isInAddLineMode={isInAddLineMode()}
                  />
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
    </section>
  );
}
