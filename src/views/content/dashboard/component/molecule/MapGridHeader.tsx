import Button from "../../../../../component/atom/Button";
import PageTitle from "../../../../../component/atom/PageTitle";

import "./MapGridHeader.css";

interface MapGridHeaderProps {
  openCreateMapModal: () => void;
}

export default function (props: MapGridHeaderProps) {
  return (
    <div class="justify-between flex items-center text-3xl">
      <PageTitle title="Tableau de bord" />
      <Button
        onClick={() => props.openCreateMapModal()}
        label="Nouvelle carte"
      />
    </div>
  );
}
