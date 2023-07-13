import "./PageTitle.css";

interface PageTitleProps {
  title: string;
}

export default function (props: PageTitleProps) {
  return <h1 class="page-title">{props.title}</h1>;
}
