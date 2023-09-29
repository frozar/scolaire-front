import BoardTitle from "../../../board/component/atom/BoardTitle";

interface ClasseBoardHeaderProps {
  title: string;
}

export default function (props: ClasseBoardHeaderProps) {
  return (
    <header class="my-6">
      <BoardTitle title={props.title} />
    </header>
  );
}
