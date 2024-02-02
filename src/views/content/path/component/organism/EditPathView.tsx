import { PathType } from "../../../../../_entities/path.entity";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { LabeledColorPicker } from "../../../board/component/molecule/LabeledColorPicker";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import SchoolsEnumeration from "../../../board/component/molecule/SchoolsEnumeration";
import { currentDrawPath, setCurrentDrawPath } from "../drawPath.utils";
import { PathTimeLine } from "./PathTimeLine";

// ! TODO show path line into map, see Line.tsx to add line to map

export function EditPathView() {
  function onInputPathName(event: Event & { target: HTMLInputElement }) {
    setCurrentDrawPath((prev) => {
      if (!prev) return prev;
      return { ...prev, name: event.target.value };
    });
  }

  function schoolsNames(): string[] {
    return (
      currentDrawPath()
        ?.schools.map((schoolId) => SchoolUtils.get(schoolId))
        .map((school) => school.name) ?? []
    );
  }

  function onChangeColor(color: string) {
    setCurrentDrawPath((path) => {
      if (!path) return path;
      return { ...path, color: color };
    });
  }

  return (
    <>
      <SchoolsEnumeration schoolsName={schoolsNames()} />
      <LabeledInputField
        value={currentDrawPath()?.name ?? "Nom par défaut"}
        placeholder="Entrer le nom du chemin"
        onInput={onInputPathName}
        label="Nom du chemin"
        name="path-name"
      />
      <LabeledColorPicker
        defaultColor={currentDrawPath()?.color}
        onChange={onChangeColor}
        text="Couleur du chemin"
      />

      <PathTimeLine path={currentDrawPath() as PathType} inEdition={true} />
    </>
  );
}
