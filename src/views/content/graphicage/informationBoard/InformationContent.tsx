import { For, Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { points } from "../../../../signaux";
import {
  NatureEnum,
  PointRamassageType,
  PointToDisplayType,
  isPointRamassage,
} from "../../../../type";
import { authenticateWrap } from "../../../layout/authentication";
import {
  getSelectedBusLineId,
  lineUnderConstructionStopNames,
} from "../line/busLinesUtils";
import InfoPointName from "./InfoPointName";
import Timeline from "./Timeline";
import BusLineInformationBoardContent from "./component/organisme/BusLineInformationBoardContent";

const [, { isInAddLineMode, resetLineUnderConstruction }] = useStateAction();

export default function () {
  const getSelectedPoint = (): PointRamassageType | null => {
    const filteredArray = points().filter((point) => point.selected());
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
      const URL = import.meta.env.VITE_BACK_URL + "/get_associated_points";

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
            const datas = await res.json();

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

  const [associatedPoints, setAssociatedPoints] = createSignal<
    PointToDisplayType[]
  >([]);

  createEffect(() => {
    fetchAssociatedPoints(selectedIdentity());
  });

  const ptToDisplay = () => {
    const wkAssociatedPoints = associatedPoints();

    return wkAssociatedPoints ? wkAssociatedPoints : [];
  };

  const firstColumnTitle = () => {
    const selectedPoint = getSelectedPoint();
    if (!selectedPoint) {
      return "";
    }

    return isPointRamassage(selectedPoint) ? "Etablissement" : "Ramassage";
  };

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
            when={0 < ptToDisplay().length}
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
                          <For each={ptToDisplay()}>
                            {(pt) => (
                              <tr>
                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <InfoPointName point={pt} />
                                </td>
                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {pt.quantity}
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
          {/* TODO look if need some parameters */}
          <BusLineInformationBoardContent />
        </Match>
        <Match
          when={
            isInAddLineMode() && lineUnderConstructionStopNames().length != 0
          }
        >
          <Timeline stopNames={lineUnderConstructionStopNames()} />
        </Match>
      </Switch>
    </div>
  );
}
