import { createSignal } from "solid-js";
import { PathEntity, PathType } from "../../../../../_entities/path.entity";
import { PathDetailHeader } from "../molecule/PathDetailHeader";

export const [selectedPath, setSelectedPath] = createSignal<PathType>();

export function PathDetail() {
  const path = () => selectedPath() ?? PathEntity.defaultPath();

  return (
    <div>
      <PathDetailHeader path={path()} />
      <p>TODO: School énumération</p>
      <p>TODO: Timeline sans la notion de temps / quantité ?</p>
    </div>
  );
}
