import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { getSelectedLine } from "../../../map/component/organism/BusLines";
import { setCurrentDrawTrip } from "../organism/DrawTripBoard";

export function PathSelection() {
  const getPaths = getSelectedLine()?.paths.map((path) => {
    return {
      value: path.id as number,
      text: path.name,
    };
  }) as [];

  function onChangePathSelector(value: string | number) {
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        path: getSelectedLine()?.paths.filter((path) => path.id == value)[0],
      };
    });
  }

  return (
    <LabeledInputSelect
      defaultValue={1}
      label="Choisir un chemin"
      onChange={onChangePathSelector}
      options={getPaths}
    />
  );
}
