import { OrganizationType } from "../../../../_entities/organization.entity";
import { OrganisationService } from "../../../../_services/organisation.service";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import { EyeIcon } from "../../../../icons/EyeIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function OrganizationsTableItem(props: {
  organization: OrganizationType;
}) {
  async function editStatus() {
    let newStatus = "";
    if (props.organization.status == "active") newStatus = "suspended";
    else newStatus = "active";
    const obj: OrganizationType = {
      id: props.organization.id,
      name: props.organization.name,
      referent: props.organization.referent,
      status: newStatus,
    };
    enableSpinningWheel();
    await OrganisationService.edit(obj);
    disableSpinningWheel();
    addNewGlobalSuccessInformation(
      "Le statut de " + obj.name + " a été changé"
    );
  }

  return (
    <TableRow class="map-row-item">
      <TableData
        class="select-none"
        text={props.organization.name}
        end={false}
      />
      <TableData
        class="select-none"
        text={props.organization.referent.email}
        end={false}
      />
      <TableData
        class="select-none"
        text={props.organization.referent.name}
        end={false}
      />
      <TableData
        class="select-none"
        text={props.organization.status}
        end={false}
      />
      <TableDataChilds end>
        <ButtonIcon onClick={() => console.log()} icon={<EyeIcon />} />
        <ButtonIcon onClick={editStatus} icon={<TrashIcon />} />
      </TableDataChilds>
    </TableRow>
  );
}
