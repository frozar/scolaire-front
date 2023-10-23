import BoardTitle from "../../../board/component/atom/BoardTitle";

interface GradeBoardHeaderProps {
  title: string;
}

export default function (props: GradeBoardHeaderProps) {
  return (
    <header class="my-6">
      <BoardTitle title={props.title} />
    </header>
  );
}
