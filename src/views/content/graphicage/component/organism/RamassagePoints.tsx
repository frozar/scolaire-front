import L, { LeafletMouseEvent } from "leaflet";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { NatureEnum } from "../../../../../type";
import { fetchStop } from "../../point.service";
import PointRamassage from "../molecule/PointRamassage";

type PointRamassageDBType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

export interface RamassagePointsProps {
  mapId: number;
  //   idPoint: number;
  //   lat: number;
  //   lon: number;
  map: L.Map;
  //   isLast: boolean;
  isBlinking?: boolean;

  //   quantity: number;
  //   minQuantity: number;
  //   maxQuantity: number;

  //   onIsLast: () => void;
  //   onClick: () => void;
  //   onDBLClick: (event: LeafletMouseEvent) => void;
  //   onMouseOver: () => void;
  //   onMouseOut: () => void;
}

export default function (props: RamassagePointsProps) {
  console.log("debut RamassagePoints");

  // TODO: Finalité => Utiliser pointRamassageType !!
  // Faire pareil pour composant enfants
  const [ramassage, setRamassage] = createSignal<PointRamassageDBType[]>([
    // {
    //   id: 1,
    //   id_point: 1,
    //   nature: NatureEnum.ramassage,
    //   lon: 55.5308837890625,
    //   lat: -20.9299793243408,
    //   name: "guillemets",
    //   quantity: 5,
    // },
    // {
    //   id: 2,
    //   id_point: 2,
    //   nature: NatureEnum.ramassage,
    //   lon: 55.5292167663574,
    //   lat: -20.9363956451416,
    //   name: "guillemetsLaSuite",
    //   quantity: 10,
    // },
  ]);

  onMount(async () => {
    console.log("RamassagePoints onMount");
    setRamassage(await fetchStop(props.mapId));
  });

  const filteredPoints = () =>
    ramassage()
      .filter((value) => Number.isFinite(value.quantity))
      .map((value) => value.quantity);

  const minQuantity = () => {
    const minCandidat = Math.min(...filteredPoints());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...filteredPoints());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  function onDBLClick(event: LeafletMouseEvent) {
    L.DomEvent.stopPropagation(event);
  }
  // function onClick(idPoint: number) {
  //   deselectAllBusLines();
  //   // selectPointById(idPoint);
  //   // ...
  // }
  // function onMouseOver() {
  //   // Mettre à jour les points à blinker
  //   // ...
  // }
  // function onMouseOut() {
  //   // Mettre à jour les points à blinker (vider)
  //   // ...
  // }

  createEffect(() => {
    console.log("ramassagePoints createEffect", ramassage());
    // Update isBlinking
  });
  // return (
  //   <>
  //     <PointRamassage
  //       idPoint={ramassage()[0].id}
  //       lat={ramassage()[0].lat}
  //       lon={ramassage()[0].lon}
  //       map={props.map}
  //       // isLast={i() === ramassage().length - 1}
  //       isLast={false}
  //       isBlinking={false}
  //       quantity={ramassage()[0].quantity}
  //       // minQuantity={minQuantity()}
  //       // maxQuantity={maxQuantity()}
  //       minQuantity={5}
  //       maxQuantity={50}
  //       onIsLast={() => ""}
  //       onClick={() => ""}
  //       onDBLClick={onDBLClick}
  //       onMouseOver={() => ""}
  //       onMouseOut={() => ""}
  //     />
  //     <PointRamassage
  //       idPoint={ramassage()[1].id}
  //       lat={ramassage()[1].lat}
  //       lon={ramassage()[1].lon}
  //       map={props.map}
  //       // isLast={i() === ramassage().length - 1}
  //       isLast={false}
  //       isBlinking={false}
  //       quantity={ramassage()[1].quantity}
  //       // minQuantity={minQuantity()}
  //       // maxQuantity={maxQuantity()}
  //       minQuantity={5}
  //       maxQuantity={50}
  //       onIsLast={() => ""}
  //       onClick={() => ""}
  //       onDBLClick={onDBLClick}
  //       onMouseOver={() => ""}
  //       onMouseOut={() => ""}
  //     />
  //   </>
  // );
  return (
    <For each={ramassage()}>
      {(point, i) => {
        const onIsLast = () => "";
        const onClick = () => "";
        const onMouseOver = () => "";
        const onMouseOut = () => "";
        console.log(point);

        return (
          // TODO: Utiliser PointRamassageType plutot !
          // Pour pas avoir à passer autant de props
          <PointRamassage
            idPoint={point.id}
            lat={point.lat}
            lon={point.lon}
            map={props.map}
            isLast={i() === ramassage().length - 1}
            // isLast={false}
            isBlinking={false}
            quantity={point.quantity}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
            // minQuantity={5}
            // maxQuantity={50}
            onIsLast={onIsLast}
            onClick={onClick}
            onDBLClick={onDBLClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          />
        );
      }}
    </For>
  );
}
