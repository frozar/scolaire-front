import { createSignal } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { SchoolService } from "../../../../../_services/school.service";
import { SchoolStore } from "../../../../../_stores/school.store";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { ViewManager } from "../../../ViewManager";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { SchoolAddContent } from "../organism/SchoolAddContent";

export function SchoolAdd() {
  const [newSchool, setNewSchool] = createSignal<SchoolType>({} as SchoolType);
  const [newHours, setNewHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );

  async function submitSchool() {
    setNewSchool((prev) => {
      return { ...prev, hours: newHours() };
    });
    if (!newSchool().calendar)
      return addNewGlobalWarningInformation("Choisir un calendrier");
    if (!newSchool().name)
      return addNewGlobalWarningInformation("Entrer un nom");
    if (!newSchool().lat)
      return addNewGlobalWarningInformation("Entrer les coordonnées");
    if (!newSchool().lon)
      return addNewGlobalWarningInformation("Entrer les coordonnées");
    if (!newSchool().waitingTime)
      return addNewGlobalWarningInformation("Entrer un temps d'attente");
    if (!SchoolUtils.isValidSchool(newSchool())) return;

    enableSpinningWheel();
    const createdSchool: SchoolType = await SchoolService.create(newSchool());
    disableSpinningWheel();
    SchoolStore.add(createdSchool);
    ViewManager.schools();
    addNewGlobalSuccessInformation("L'école a été crée");
  }

  return (
    <section>
      <header class="my-6">
        <BoardTitle title="Ajouter une école" />
      </header>
      <div>
        <SchoolAddContent
          hours={newHours()}
          hoursSetter={setNewHours}
          school={newSchool()}
          schoolSetter={setNewSchool}
        />
        <BoardFooterActions
          nextStep={{
            callback: submitSchool,
            label: "Valider",
          }}
          previousStep={{
            callback: ViewManager.schools,
            label: "Annuler",
          }}
        />
      </div>
    </section>
  );
}
