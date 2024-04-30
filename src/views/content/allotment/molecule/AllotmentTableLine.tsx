import { Show, createSignal, onMount } from "solid-js";
import { AllotmentService } from "../../../../_services/allotment.service";
import {
  AllotmentStore,
  AllotmentType,
} from "../../../../_stores/allotment.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { AllotmentEditMenu } from "./AllotmentEditMenu";
import { AllotmentTableLineData } from "./AllotmentTableLineData";

interface AllotmentTableLineProps {
  allotmentItem: AllotmentType;
  editList: (allotment: AllotmentType) => void;
}

export const [isAllotmentMenuOpen, setIsAllotmentMenuOpen] =
  createSignal(false);

export function AllotmentTableLine(props: AllotmentTableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);
  const [localAllotment, setlocalAllotment] = createSignal<AllotmentType>(
    {} as AllotmentType
  );

  onMount(() => {
    setlocalAllotment(props.allotmentItem);
  });

  function toggleEditMode() {
    if (isInEditMode()) {
      setisInEditMode(false);
      props.editList(localAllotment());
    } else setisInEditMode(true);
  }

  async function deleteAllotment() {
    enableSpinningWheel();
    await AllotmentService.deleteAllotment(props.allotmentItem.id);
    disableSpinningWheel();
    AllotmentStore.remove(props.allotmentItem.id as number);
    addNewGlobalSuccessInformation("L'allotissement a bien été supprimé");
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <AllotmentTableLineData
          allotment={localAllotment()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteAllotment}
        />
      }
    >
      <td colSpan={5}>
        <AllotmentEditMenu
          allotment={localAllotment()}
          allotmentSetter={setlocalAllotment}
          toggleEdit={toggleEditMode}
        />
      </td>
    </Show>
  );
}
