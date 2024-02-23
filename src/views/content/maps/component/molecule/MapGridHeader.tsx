import Button from "../../../../../component/atom/Button";
import PageTitle from "../../../../../component/atom/PageTitle";
import { getSelectedOrganisation } from "../../../board/component/organism/OrganisationSelector";

import "./MapGridHeader.css";

interface MapGridHeaderProps {
  openCreateMapModal: () => void;
}

export default function (props: MapGridHeaderProps) {
  return (
    <div class="justify-between flex items-center text-3xl">
      <PageTitle title="Liste de vos cartes" />
      <Button
        onClick={() => props.openCreateMapModal()}
        isDisabled={testDisable()}
        label="Nouvelle carte"
      />
    </div>
  );
}
function testDisable(): boolean | undefined {
  return (
    getSelectedOrganisation().organisation_id === null ||
    getSelectedOrganisation().organisation_id < 1
  );
}
