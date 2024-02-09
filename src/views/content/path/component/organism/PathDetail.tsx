import { createSignal } from "solid-js";
import { PathEntity, PathType } from "../../../../../_entities/path.entity";
import { PathUtil } from "../../../../../utils/path.utils";
import SchoolsEnumeration from "../../../board/component/molecule/SchoolsEnumeration";
import { PathDetailHeader } from "../molecule/PathDetailHeader";
import { PathTimeLine } from "./PathTimeLine";

export const [selectedPath, setSelectedPath] = createSignal<PathType>();

export function PathDetail() {
  const path = () => selectedPath() ?? PathEntity.defaultPath();
  const schoolsNames = () =>
    PathUtil.getSchoolsInPath(selectedPath())?.map((school) => school.name);

  return (
    <div>
      <PathDetailHeader path={path()} />
      <SchoolsEnumeration schoolsName={schoolsNames() ?? []} />
      <PathTimeLine path={path()} inEdition={false} />
    </div>
  );
}
