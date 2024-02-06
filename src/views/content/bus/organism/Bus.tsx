import Button from "../../../../component/atom/Button";
import PageTitle from "../../../../component/atom/PageTitle";
import { BusTable } from "../molecule/BusTable";

export function Bus() {
  return (
    <div class="busPageLayout">
      <div class="busPageTopItems">
        <PageTitle title="Bus" />
        <Button label="Ajouter" onClick={() => console.log("test")} />
      </div>
      <BusTable />
    </div>
  );
}
