import "./RightTimeLineContent.css";

interface RightTimeLineContentProps {
  countToGet: string;
  name: string;
  totalCount: string;
}

export function RightTimeLineContent(props: RightTimeLineContentProps) {
  return (
    <div class="path-timeline-component">
      <p class="count-to-get">{props.countToGet}</p>
      <p class="stop-name">{props.name}</p>
      <p class="total-count">{props.totalCount}</p>
    </div>
  );
}
