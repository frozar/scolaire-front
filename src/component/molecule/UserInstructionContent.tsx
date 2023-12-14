import "./UserInstructionContent.css";

interface UserInstructionContentProps {
  message: string;
  type: InstructionEnum;
}

export enum InstructionEnum {
  information = "Information",
  alert = "Alerte",
}

export default function (props: UserInstructionContentProps) {
  return (
    <div
      id="instruction-box"
      class={
        props.type === InstructionEnum.alert ? "alert-error" : "alert-success"
      }
    >
      <span class="text-xl p-4">{props.message}</span>
    </div>
  );
}
