import { For, createEffect, createSignal } from "solid-js";
import { LineType, NatureEnum } from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import TimelineItemReadMode from "../component/atom/TimelineItemReadMode";
import { studentsToSchool } from "../component/organism/Points";
import { mapIdentityToResourceType } from "../line/busLinesUtils";

interface itemInfoToDisplayInterface {
  point: PointInterface;
  quantity: number;
}

const [itemsInfoToDisplay, setItemsInfoToDisplay] = createSignal<
  itemInfoToDisplayInterface[]
>([]);

export default function (props: { line: () => LineType | undefined }) {
  createEffect(() => {
    const line = props.line();
    if (!line) {
      return;
    }
    const stops = line.stops;

    const schoolsIdPoint = [
      ...new Set(
        stops
          .filter((point) => point.nature === NatureEnum.etablissement)
          .map((school) => school.idPoint)
      ),
    ];

    const schoolQuantity: { [id: number]: number } = {};
    for (const idPoint of schoolsIdPoint) {
      schoolQuantity[idPoint] = 0;
    }

    const itemsInfoToDisplay: itemInfoToDisplayInterface[] = [];

    for (const stop of mapIdentityToResourceType(stops)) {
      let quantity = 0;

      if (stop.nature === NatureEnum.ramassage) {
        studentsToSchool()
          .filter(
            (data) =>
              schoolsIdPoint.includes(data.etablissement_id_point) &&
              data.ramassage_id_point === stop.idPoint
          )
          .map((data) => {
            for (const idPoint of schoolsIdPoint) {
              if (idPoint === data.etablissement_id_point) {
                schoolQuantity[idPoint] += data.quantity;
              }
            }
            quantity += data.quantity;
          });
      } else {
        quantity = schoolQuantity[stop.idPoint];
        schoolQuantity[stop.idPoint] = 0;
      }

      itemsInfoToDisplay.push({ point: { ...stop }, quantity });
    }
    setItemsInfoToDisplay(itemsInfoToDisplay);
  });

  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={itemsInfoToDisplay()}>
          {(itemInfoToDisplay) => (
            <>
              <TimelineItemReadMode
                pointsResource={itemInfoToDisplay.point}
                getter={props.line}
                quantityToDisplay={itemInfoToDisplay.quantity}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
