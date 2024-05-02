import { AllotmentStore } from "../../../../_stores/allotment.store";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";

export function AssignallotmentStep(props: {
  allotment: number;
  onUpdateAllotment: (allotmentId: number) => void;
}) {
  return (
    <LabeledInputSelect
      defaultValue={Number(props.allotment)}
      label="Allotissement"
      onChange={(value: string | number) =>
        props.onUpdateAllotment(Number(value))
      }
      options={AllotmentStore.get().map((allotment) => {
        return { value: Number(allotment.id), text: allotment.name };
      })}
    />
  );
}
