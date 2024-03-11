import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";

export function DashboardSchool() {
  return (
    <LabeledInputSelect
      defaultValue={0}
      label="Etablissement"
      onChange={() => console.log("Etablissement")}
      options={[
        { text: "Ecole 1", value: 0 },
        { text: "Ecole 2", value: 1 },
        { text: "Ecole 3", value: 2 },
      ]}
    />
  );
}
