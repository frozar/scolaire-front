import { BusLineType } from "../../../../../../_entities/bus-line.entity";
import { MetricItem, MetricItemProps } from "../atom/MetricItem";

export interface MetricsEnumerationProps {
  metrics: MetricItemProps[];
}
export type MetricsProps = {
  line?: Pick<BusLineType, "metrics">;
};

export default function (props: MetricsProps) {
  return (
    <>
      <MetricItem
        title={"Distance parcourue"}
        value={mToKm(props.line?.metrics()?.distance)}
        unite={"km"}
      />

      <MetricItem
        title={"Degré de déviation"}
        value={props.line?.metrics()?.deviation}
      />

      <MetricItem
        title={"Temps de parcours"}
        value={displayedTime(props.line?.metrics()?.duration)}
        unite={getMetricDuration(props.line?.metrics()?.duration)}
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

function mToKm(value: number | undefined) {
  return value ? value / 1000 : undefined;
}

function displayedTime(value: number | undefined) {
  if (value) {
    return value > 3600 ? sToH(value) : sToM(value);
  }
}
function sToH(value: number) {
  let duration;
  duration = value / 3600;
  duration = roundDecimal(duration, 2);
  return duration;
}

function sToM(value: number) {
  let duration;
  duration = value / 60;
  duration = roundDecimal(duration, 2);
  return duration;
}

function roundDecimal(nombre: number, precision: number) {
  const tmp = Math.pow(10, precision);
  return Math.round(nombre * tmp) / tmp;
}

function getMetricDuration(value: number | undefined) {
  if (value) {
    return value > 3600 ? "h" : "min";
  }
}
