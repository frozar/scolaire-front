import TableActionButton from "../atom/TableActionButton";

interface TableBodyRowActionsProps {
  editHandler: () => void;
  deleteHandler: () => void;
}

export default function (props: TableBodyRowActionsProps) {
  return (
    <td>
      <TableActionButton
        label="Editer"
        onClickHandler={props.editHandler}
        _class="text-[#0CC683] hover:text-indigo-600 mr-2"
      />

      <TableActionButton
        label="Supprimer"
        onClickHandler={props.deleteHandler}
        isDisabled={true}
      />
    </td>
  );
}
