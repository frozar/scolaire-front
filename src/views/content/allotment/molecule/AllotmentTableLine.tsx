import { Show, createEffect, createSignal } from "solid-js";
import { AllotmentService } from "../../../../_services/allotment.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { setIsAllotmentEdited } from "../../market/molecule/allotment/AllotmentTab";
import { AllotmentType, setAllotment } from "../organism/Allotment";
import { AllotmentEditMenu } from "./AllotmentEditMenu";
import { AllotmentTableLineData } from "./AllotmentTableLineData";

interface AllotmentTableLineProps {
  allotmentItem: AllotmentType;
}

export function AllotmentTableLine(props: AllotmentTableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);
  const [getName, setName] = createSignal("");
  const [getColor, setColor] = createSignal("");

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  createEffect(() => {
    setName(props.allotmentItem.name);
    setColor(props.allotmentItem.color);
  });

  async function deleteAllotment() {
    enableSpinningWheel();
    await AllotmentService.deleteAllotment(props.allotmentItem.id);
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "L'allotissement a bien été supprimé",
    });
  }

  function onNameInputChanged(value: string) {
    setName(value);
    // eslint-disable-next-line solid/reactivity
    setAllotment((prev) => {
      return [...prev].map((item) => {
        if (item.id == props.allotmentItem.id) {
          item.name = value;
        }
        return item;
      });
    });
    setIsAllotmentEdited(true);
  }

  function onColorInputChanged(value: string) {
    setColor(value);
    // eslint-disable-next-line solid/reactivity
    setAllotment((prev) => {
      return [...prev].map((item) => {
        if (item.id == props.allotmentItem.id) {
          item.color = value;
        }
        return item;
      });
    });
    setIsAllotmentEdited(true);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <AllotmentTableLineData
          name={props.allotmentItem.name}
          color={props.allotmentItem.color}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteAllotment}
        />
      }
    >
      <td colSpan={5}>
        <AllotmentEditMenu
          id={props.allotmentItem.id}
          color={getColor()}
          name={getName()}
          onColorInput={onColorInputChanged}
          onNameInput={onNameInputChanged}
        />
      </td>
    </Show>
  );
}
