import { Setter } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import { EtablissementItemType } from "../../../../../type";
import { setDataToEdit, toggleEditStop } from "../../EditEtablissement";
import TableBodyRow from "../atom/TableBodyRow";
import TableBodyRowActions from "../molecule/TableBodyRowActions";
import TableBodyRowCheckBox from "../molecule/TableBodyRowCheckBox";

function handleClickEdit(item: EtablissementItemType) {
  setDataToEdit(item);
  toggleEditStop();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleClickSuppression(item: EtablissementItemType) {
  // setRemoveEtablissementConfirmation({ displayed: true, item });
}

export default function (props: {
  item: EtablissementItemType;
  setEtablissements: Setter<EtablissementItemType[]>;
}) {
  return (
    <tr>
      <TableBodyRowCheckBox
        selected={() => props.item.selected}
        label={props.item.name}
        checkboxHandler={(checked) => {
          const itemId = props.item.id;

          props.setEtablissements((etablissements) =>
            etablissements.map((eta) =>
              eta.id === itemId ? { ...eta, selected: checked } : eta
            )
          );
        }}
      />
      <TableBodyRow label={props.item.quantity.toString()} />
      <TableBodyRow label={props.item.nbLine.toString()} />
      <TableBodyRowActions
        editHandler={() => handleClickEdit(props.item)}
        deleteHandler={() => handleClickSuppression(props.item)}
      />
    </tr>
  );
}
