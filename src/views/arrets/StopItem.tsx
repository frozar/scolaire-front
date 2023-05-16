import { StopLineItem } from "../../type";
import { setDataToEdit, toggleEditStop } from "./EditStop";

export default function (props: StopLineItem) {
  const handleClickEdit = () => {
    setDataToEdit({ ...props });
    toggleEditStop();
  };

  return (
    <tr>
      <td class="flex items-center">
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
        />
        {props.name}
      </td>
      <td>{props.quantity}</td>
      <td>{props.nbEtablissement}</td>
      <td>{props.nbLine}</td>
      <td>
        <a onClick={handleClickEdit} href="#" class="text-[#0CC683] mr-2">
          Editer
        </a>

        <a href="#" class="text-[#F44434]">
          Supprimer
        </a>
      </td>
    </tr>
  );
}
