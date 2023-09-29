import "./BoardTitle.css";

interface BoardTitleProps {
  title: string;
}

export default function (props: BoardTitleProps) {
  return <p class="board-title">{props.title}</p>;
}
