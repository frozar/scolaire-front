import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { getAllotment } from "../../allotment/organism/Allotment";

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
      options={getAllotment().map((allotment) => {
        return { value: Number(allotment.id), text: allotment.name };
      })}
    />
  );
}
