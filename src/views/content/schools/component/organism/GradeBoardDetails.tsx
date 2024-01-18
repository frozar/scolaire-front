import { JSXElement } from "solid-js";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { GradeUtils } from "../../../../../utils/grade.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { selectedGrade, setSelectedGrade } from "./GradeBoard";
import { HourRuleList } from "./HourRuleList";

// TODO: Refactor all read board headers css (trip, stop, school, grade)
import "./GradeBoardDetails.css";

// TODO: Display more informations as linked stops, trips and quantity
// TODO: Refactor
export function GradeBoardDetails(): JSXElement {
  return (
    <section>
      <header class="grade-detail-header">
        <div class="grade-detail-header-title">
          <p>{selectedGrade()?.name as string}</p>
          <div>
            <ButtonIcon
              icon={<PencilIcon />}
              onClick={() => setOnBoard("school-grade-modify")}
            />
            <ButtonIcon
              icon={<TrashIcon />}
              onClick={() => console.log("todo delete")}
            />
          </div>
        </div>

        <p>
          {GradeUtils.getTotalQuantity(selectedGrade()?.id as number) +
            " élèves"}
        </p>
      </header>

      {/* TODO: Display schedule informations */}
      <div class="mb-4">
        <div class="text-xl">Calendrier:</div>
        <div class="text-green-base pl-[18px]">
          {selectedGrade()?.calendar?.name as string}
        </div>
      </div>

      <div>
        <CollapsibleElement
          title="Tranches horaires"
          titleClass="text-xl"
          closedByDefault={() => true}
        >
          <TimesInputWrapper
            label="Matin"
            startValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.startHourComing
            )}
            endValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.endHourComing
            )}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <TimesInputWrapper
            label="Après-midi"
            startValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.startHourGoing
            )}
            endValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.endHourGoing
            )}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <HourRuleList
            item={selectedGrade}
            setItem={setSelectedGrade}
            enabled={false}
          />
        </CollapsibleElement>
      </div>
      {/* TODO: Display linked entity informations (stops, trips) and quantity infos */}
    </section>
  );
}
