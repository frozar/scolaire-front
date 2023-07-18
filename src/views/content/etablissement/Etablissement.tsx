import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useStateGui } from "../../../StateGui";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import PageTitle from "../../../component/atom/PageTitle";
import { EtablissementItemType } from "../../../type";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import { authenticateWrap } from "../../layout/authentication";
import EditStop from "./EditEtablissement";
import EtablissementItem from "./EtablissementItem";
import Checkbox from "./component/atom/Checkbox";
import Filters, { searchInputKeyword } from "./component/organism/Filters";
import TableBody from "./component/organism/TableBody";

const [, { getActiveMapId }] = useStateGui();

const [etablissements, setEtablissements] = createSignal<
  EtablissementItemType[]
>([]);

export function fetchEtablissement() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/dashboard/etablissement`,
      {
        method: "GET",
        headers,
      }
    ).then(async (res) => {
      const json = await res.json();

      const datas: {
        id: number;
        name: string;
        quantity: number;
        nb_line: number;
        lon: number;
        lat: number;
      }[] = json["content"];

      setEtablissements(
        datas
          .map((elt) => {
            return {
              ...elt,
              nbLine: elt.nb_line,
              selected: false,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  });
}

function preventDefaultHandler(e: DragEvent) {
  e.preventDefault();
}

export default function () {
  let etablissementDiv!: HTMLDivElement;

  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const filteredEtablissements = () =>
    etablissements().filter((e) =>
      e.name.toLowerCase().includes(searchInputKeyword().toLowerCase())
    );

  const selectedEtablissements = () =>
    etablissements().filter((eta) => eta.selected);

  createEffect(() => {
    refCheckbox().checked =
      filteredEtablissements().length != 0 &&
      selectedEtablissements().length == filteredEtablissements().length;
  });

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(() => {
    fetchEtablissement();
    etablissementDiv.addEventListener("dragenter", dragEnterHandler);
    etablissementDiv.addEventListener("drop", preventDefaultHandler);
    etablissementDiv.addEventListener("dragleave", preventDefaultHandler);
    etablissementDiv.addEventListener("dragend", preventDefaultHandler);
    etablissementDiv.addEventListener("dragover", preventDefaultHandler);
  });

  onCleanup(() => {
    etablissementDiv.removeEventListener("dragenter", dragEnterHandler);
    etablissementDiv.removeEventListener("drop", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragleave", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragend", preventDefaultHandler);
    etablissementDiv.removeEventListener("dragover", preventDefaultHandler);
  });

  return (
    <>
      <ImportCsvDialogBox />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          fetchEtablissement();
        }}
      />
      <RemoveRamassageConfirmation />
      <div class="flex w-full bg-white" ref={etablissementDiv}>
        <div id="ramassages-board">
          <header>
            <div>
              <PageTitle title="Etablissements" />
            </div>
            <Filters />
          </header>
          <div class="board-content">
            <div class="h-[78vh]">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="flex items-center"
                      style={{ height: "inherit" }}
                    >
                      <Checkbox
                        ariaDescribedby="etablissement-item"
                        name="etablissement"
                        ref={setRefCheckbox}
                        onChange={() => {
                          setEtablissements((etablissements) =>
                            etablissements.map((eta) => ({
                              ...eta,
                              selected: refCheckbox().checked,
                            }))
                          );
                        }}
                      />
                    </th>
                    <th scope="col">Nom</th>
                    <th scope="col">Nombre d'élèves</th>
                    <th scope="col">Nombre de lignes</th>
                    <th scope="col">
                      <span class="">Actions</span>
                    </th>
                  </tr>
                </thead>
                <TableBody>
                  <For each={filteredEtablissements()}>
                    {(fields) => {
                      return (
                        <EtablissementItem
                          item={fields}
                          setEtablissements={setEtablissements}
                        />
                      );
                    }}
                  </For>
                </TableBody>
              </table>
            </div>
          </div>
        </div>
        <EditStop />
      </div>
    </>
  );
}
