import { createEffect } from "solid-js";
import { BusLineType } from "../../../../../../_entities/bus-line.entity";
import { MetricItem, MetricItemProps } from "../atom/MetricItem";

export interface MetricsEnumerationProps {
  metrics: MetricItemProps[];
}
export type MetricsProps = {
  line?: Pick<BusLineType, "metrics">;
};

export default function (props: MetricsProps) {
  createEffect(() => console.log(props));
  return (
    <>
      <MetricItem
        title={"Distance parcourue"}
        value={props.line?.metrics()?.distanceBus}
        unite={"km"}
      />

      <MetricItem
        title={"Degré de déviation"}
        value={props.line?.metrics()?.deviation}
      />

      <MetricItem
        title={"Temps de parcours"}
        value={props.line?.metrics()?.temps}
        unite={"h"}
      />

      <MetricItem
        title={"Kilomètre passager"}
        value={props.line?.metrics()?.kmPassager}
        unite={"km"}
      />

      <MetricItem
        title={"Taux de remplissage moyen"}
        value={props.line?.metrics()?.txRemplissMoy}
        unite={"personnes"}
      />
      <MetricItem title={"Économie CO²"} value={props.line?.metrics()?.CO2} />
    </>
  );
}
