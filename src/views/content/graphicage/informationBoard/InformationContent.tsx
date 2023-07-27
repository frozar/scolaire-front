import { For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import { updateBusLine } from "../../../../request";
import { addNewUserInformation } from "../../../../signaux";
import {
  LineType,
  MessageLevelEnum,
  MessageTypeEnum,
  NatureEnum,
  PointToDisplayType,
  isPointRamassage,
} from "../../../../type";
import { authenticateWrap } from "../../../layout/authentication";
import { ColorPicker } from "../component/atom/ColorPicker";
import { PointInterface } from "../component/atom/Point";
import AddLineInformationBoardContent from "../component/organism/AddLineInformationBoardContent";
import { etablissements } from "../component/organism/PointsEtablissement";
import { ramassages } from "../component/organism/PointsRamassage";
import {
  linkBusLinePolyline,
  pickerColor,
  setBusLines,
} from "../line/BusLines";
import {
  getSelectedBusLine,
  getSelectedBusLineId,
  selectedBusLineInfos,
} from "../line/busLinesUtils";
import InfoPointName from "./InfoPointName";
import Timeline from "./Timeline";

const [, { isInAddLineMode, resetLineUnderConstruction }] = useStateAction();

const [, { getActiveMapId }] = useStateGui();
// TODO: Delete points() when no longer used (replaced by stops and schools)
export default function () {
  const getSelectedPoint = (): PointInterface | null => {
    const points = [...ramassages(), ...etablissements()];

    const filteredArray = points.filter((point) => point.selected());

    if (filteredArray.length === 0) {
      return null;
    } else {
      return filteredArray[0];
    }
  };

  createEffect(() => {
    // When switching mode
    if (!isInAddLineMode()) {
      resetLineUnderConstruction();
    }
  });

  const selectedIdentity = () => {
    const selectedPoint = getSelectedPoint();
    if (!selectedPoint) {
      return null;
    }
    const { id, idPoint, nature } = selectedPoint;
    return { id, idPoint, nature };
  };

  const fetchAssociatedPoints = async (
    selectedIdentityWk: {
      id: number;
      nature: NatureEnum;
    } | null
  ) => {
    if (!selectedIdentityWk) {
      return;
    }
    const { id, nature } = selectedIdentityWk;

    if (id == -1 || nature == null) {
      return [];
    } else {
      const URL =
        import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/eleve_vers_etablissement/associated_points`;
      // TODO:
      // Attemp to use authenticateWrap failed => Don't use the 'createResource' from solidjs
      authenticateWrap((headers) => {
        fetch(
          URL +
            "?" +
            new URLSearchParams({
              id: String(id),
              nature: nature.toLowerCase(),
            }),
          {
            headers,
          }
        )
          .then(async (res) => {
            const json = await res.json();

            const datas = json.content;
            // Rename "id_point" -> "idPoint"
            const datasWk = datas.map(
              (data: { id_point: number; name: string; quantity: number }) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id_point: _, ...dataWk } = {
                  ...data,
                  idPoint: data.id_point,
                };
                return dataWk;
              }
            );
            setAssociatedPoints(datasWk);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  };
  //TODO Fix ESLint without using exception
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [associatedPoints, setAssociatedPoints] = createSignal<
    PointToDisplayType[]
  >([]);

  createEffect(() => {
    fetchAssociatedPoints(selectedIdentity());
  });

  const firstColumnTitle = () => {
    const selectedPoint = getSelectedPoint();
    if (!selectedPoint) {
      return "";
    }

    return isPointRamassage(selectedPoint) ? "Etablissement" : "Ramassage";
  };

  const handleColorPicker = (color: string) => {
    const selectedBusLineId = getSelectedBusLineId();

    if (!selectedBusLineId) {
      return;
    }

    linkBusLinePolyline[selectedBusLineId].polyline.setStyle({
      color: color,
    });

    const arrows = linkBusLinePolyline[selectedBusLineId].arrows;

    for (const arrow of arrows) {
      const arrowHTML = arrow.getElement();
      if (!arrowHTML) {
        return;
      }

      const iconHTMLorNull = arrowHTML.firstElementChild;
      if (!iconHTMLorNull) {
        return;
      }

      const iconHTML = iconHTMLorNull as SVGElement;
      iconHTML.setAttribute("fill", color);
    }
  };

  const handleColorChanged = (color: string) => {
    const selectedBusLine = getSelectedBusLine();
    if (!selectedBusLine) {
      return;
    }

    const selectedBusLineId = selectedBusLine.idBusLine;

    updateBusLine(selectedBusLineId, color)
      .then(() => {
        setBusLines((prevBusLines) => {
          const busLinesWithoutSelectedBusLine = prevBusLines.filter(
            (busLine) => busLine.idBusLine != selectedBusLineId
          );

          const busLineWithNewColor: LineType = {
            ...selectedBusLine,
            color,
          };

          return [...busLinesWithoutSelectedBusLine, busLineWithNewColor];
        });
      })
      .catch((err) => {
        console.log(err);
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content:
            "Une erreur est survenue lors de la modification de couleur de la ligne",
        });
      });
  };
  function getDisplayPoints() {
    const points = [...ramassages(), ...etablissements()];

    const associatedIdPoints = getSelectedPoint()
      ?.associatedPoints()
      .map((point) => point.idPoint);

    return points.filter((point) =>
      associatedIdPoints?.includes(point.idPoint)
    );
  }

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
      }}
    >
      <Switch fallback={<span>Aucun élément sélectionné</span>}>
        <Match when={getSelectedPoint()}>
          <h2>{getSelectedPoint()?.name}</h2>
          <Show
            when={0 < getDisplayPoints().length}
            fallback={<span>Aucun élément à afficher</span>}
          >
            <div class="px-4 sm:px-6 lg:px-8">
              <div class="mt-8 flex flex-col">
                <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              {firstColumnTitle()}
                            </th>
                            <th
                              scope="col"
                              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                              Quantité
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <For each={getDisplayPoints()}>
                            {(pt) => (
                              <tr>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <InfoPointName point={pt} />
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {/* TODO add Quantity */}
                                  {/* {pt.quantity} */}
                                </td>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </Match>
        <Match when={getSelectedBusLineId()}>
          <ColorPicker
            color={pickerColor()}
            title="Couleur de la ligne"
            onInput={handleColorPicker}
            onChange={handleColorChanged}
          />

          <Timeline point={selectedBusLineInfos()} />
        </Match>
        <Match when={isInAddLineMode()}>
          <AddLineInformationBoardContent />
        </Match>
      </Switch>
    </div>
  );
}
