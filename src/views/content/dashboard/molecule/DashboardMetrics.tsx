interface DashboardMetricsProps {
  distance: number;
  kmPassager: number;
  students: number;
}

export function DashboardMetrics(props: DashboardMetricsProps) {
  return (
    <div>
      <div>Distance totale : {props.distance} km</div>
      <div>Nombre d'élèves : 0</div>
      <div>Coût : -</div>
      <div>Km passager moyen : {props.kmPassager} </div>
      <div>Economie CO² : -</div>
    </div>
  );
}
