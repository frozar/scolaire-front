import { BusLineType } from "../../../../../_entities/bus-line.entity";
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
        value={displayedDistance(props.line?.metrics()?.distance) + " km"}
      />

      <MetricItem
        title={"Degré de déviation"}
        value={(props.line?.metrics()?.deviation ?? "") + ""}
      />

      <MetricItem
        title={"Temps de parcours"}
        value={displayedTime(props.line?.metrics()?.duration)}
      />

      <MetricItem
        title={"Kilomètre passager"}
        value={(props.line?.metrics()?.kmPassager ?? "") + ""}
      />

      <MetricItem
        title={"Taux de remplissage moyen"}
        value={(props.line?.metrics()?.txRemplissMoy ?? "") + ""}
      />

      <MetricItem
        title={"Économie CO²"}
        value={(props.line?.metrics()?.CO2 ?? "") + ""}
      />
    </>
  );
}

function displayedDistance(value: number | undefined) {
  return value ? roundDecimal(value / 1000, 2) : "";
}

function displayedTime(value: number | undefined): string {
  if (!value) return "";

  const seconde = value % 60;

  value = (value - seconde) / 60;

  const minute = value % 60;

  const heure = (value - minute) / 60;

  const displayedHeure = heure ? heure + " h " : "";
  const displayedMin = minute ? minute + " min " : "";
  // const displayedSeconde=seconde?seconde+" s ":""

  return displayedHeure + displayedMin;
}

function roundDecimal(nombre: number, precision: number) {
  const tmp = Math.pow(10, precision);
  return Math.round(nombre * tmp) / tmp;
}
