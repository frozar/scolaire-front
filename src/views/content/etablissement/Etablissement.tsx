import { createSignal, onCleanup, onMount } from "solid-js";
import { useStateGui } from "../../../StateGui";
import ImportCsvCanvas from "../../../component/ImportCsvCanvas";
import ImportCsvDialogBox from "../../../component/ImportCsvDialogBox";
import { EtablissementItemType } from "../../../type";
import RemoveRamassageConfirmation from "../../../userInformation/RemoveRamassageConfirmation";
import { authenticateWrap } from "../../layout/authentication";
import EditStop from "./EditEtablissement";
import EtablissementHeader from "./component/organism/EtablissementHeader";
import EtablissementTable from "./component/organism/EtablissementTable";
import "./etablissement.css";

const [, { getActiveMapId }] = useStateGui();

export const [etablissements, setEtablissements] = createSignal<
  EtablissementItemType[]
>([
  {
    id: 1,
    name: "pio",
    quantity: 1,
    nbLine: 1,
    lon: 1,
    lat: 1,
    selected: false,
  },
  {
    id: 2,
    name: "test",
    quantity: 1,
    nbLine: 1,
    lon: 1,
    lat: 1,
    selected: false,
  },
]);

export function fetchEtablissement() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/dashboard/etablissements`,
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

  const [displayImportCsvCanvas, setDisplayImportCsvCanvas] =
    createSignal(false);

  function dragEnterHandler(e: DragEvent) {
    e.preventDefault();
    setDisplayImportCsvCanvas(true);
  }

  onMount(() => {
    // fetchEtablissement();
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
    <div>
      <ImportCsvDialogBox />
      <ImportCsvCanvas
        display={displayImportCsvCanvas()}
        setDisplay={setDisplayImportCsvCanvas}
        callbackSuccess={() => {
          fetchEtablissement();
        }}
      />
      <RemoveRamassageConfirmation />

      <div
        id="etablissement-board"
        class="flex w-full bg-white"
        ref={etablissementDiv}
      >
        <div id="ramassages-board">
          <EtablissementHeader />

          <div class="board-content">
            <div>
              <EtablissementTable />
            </div>
          </div>
        </div>
        <EditStop />
      </div>
    </div>
  );
}
