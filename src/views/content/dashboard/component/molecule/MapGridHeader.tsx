import Button from "../../../../../component/atom/Button";

import "./MapGridHeader.css";

interface MapGridHeaderProps {
  openCreateMapModal: () => void;
}

export default function (props: MapGridHeaderProps) {
  return (
    <div class="justify-between flex items-center text-3xl">
      <h1>Tableau de bord</h1>
      <Button
        onClick={() => props.openCreateMapModal()}
        label="Nouvelle carte"
      />
    </div>
  );
}
