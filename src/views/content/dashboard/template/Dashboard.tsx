import { Match, Switch, createSignal } from "solid-js";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { DashboardAllotment } from "../organisme/DashboardAllotment";
import { DashboardGlobal } from "../organisme/DashboardGlobal";
import { DashboardSchool } from "../organisme/DashboardSchool";

enum DashboardViewEnum {
  global,
  allotment,
  school,
}

export function Dashboard() {
  const [selectedFilter, setSelectedFilter] = createSignal(
    DashboardViewEnum.global
  );

  return (
    <div class="px-10 w-full bg-white">
      <div class="h-[calc(100vh-60px)]">
        <div class="pt-5 mb-3">Dashboard</div>
        <LabeledInputSelect
          defaultValue={selectedFilter()}
          label="Vue"
          onChange={setSelectedFilter}
          options={[
            { text: "Vue Globale", value: DashboardViewEnum.global },
            { text: "Vue par Lot", value: DashboardViewEnum.allotment },
            { text: "Vue par Etablissement", value: DashboardViewEnum.school },
          ]}
        />
        <Switch>
          <Match when={selectedFilter() == DashboardViewEnum.global}>
            <DashboardGlobal />
          </Match>
          <Match when={selectedFilter() == DashboardViewEnum.allotment}>
            <DashboardAllotment />
          </Match>
          <Match when={selectedFilter() == DashboardViewEnum.school}>
            <DashboardSchool />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
