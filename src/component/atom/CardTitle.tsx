import "./CardTitle.css";

interface CardTitleProps {
  title: string;
}

export default function (props: CardTitleProps) {
  return <p class="card-title">{props.title}</p>;
}
