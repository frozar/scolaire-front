import "./UserInstructionContent.css";

interface UserInstructionContentProps {
  message: string;
}

export default function (props: UserInstructionContentProps) {
  return (
    <div
      id="instruction-box"
      class="flex items-center justify-center bg-green-light rounded-lg"
    >
      <span class="text-xl p-4">{props.message}</span>
    </div>
  );
}
