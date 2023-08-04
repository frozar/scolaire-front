import { For, createEffect, createSignal } from "solid-js";
import { LineType, NatureEnum } from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import TimelineItemReadMode from "../component/atom/TimelineItemReadMode";
import { studentsToSchool } from "../component/organism/Points";
import { mapIdentityToResourceType } from "../line/busLinesUtils";

interface ToDisplay extends PointInterface {
  quantityToDisplay: number;
}

const [valuesToDisplay, setValuesToDisplay] = createSignal<ToDisplay[]>([]);

export default function (props: { line: () => LineType | undefined }) {
  createEffect(() => {
    const line = props.line();
    if (!line) {
      return;
    }
    const stops = line.stops;

    const etablissementsIdPoint = [
      ...new Set(
        stops
          .filter((point) => point.nature === NatureEnum.etablissement)
          .map((etablissement) => etablissement.idPoint)
      ),
    ];

    const specificQuantity: { [id: number]: number } = {};
    for (const idPoint of etablissementsIdPoint) {
      specificQuantity[idPoint] = 0;
    }

    const toDisplay: ToDisplay[] = [];

    for (const stop of mapIdentityToResourceType(props.line()?.stops)) {
      let pointQuantity = 0;
      let quantityToDisplay = 0;

      if (stop.nature === NatureEnum.ramassage) {
        studentsToSchool()
          .filter(
            (data) =>
              etablissementsIdPoint.includes(data.etablissement_id_point) &&
              data.ramassage_id_point === stop.idPoint
          )
          .map((data) => {
            for (const etablissementIdPoint of etablissementsIdPoint) {
              if (etablissementIdPoint === data.etablissement_id_point) {
                specificQuantity[etablissementIdPoint] += data.quantity;
              }
            }
            pointQuantity += data.quantity;
          });
        quantityToDisplay = pointQuantity;
      } else {
        quantityToDisplay = specificQuantity[stop.idPoint];
        specificQuantity[stop.idPoint] = 0;
      }

      toDisplay.push({ ...stop, quantityToDisplay });
    }
    setValuesToDisplay(toDisplay);
  });

  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={valuesToDisplay()}>
          {(toDisplay) => (
            <>
              <TimelineItemReadMode
                pointsResource={toDisplay}
                getter={props.line}
                quantityToDisplay={toDisplay.quantityToDisplay}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
