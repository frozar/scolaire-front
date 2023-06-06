export default function (props: { path: boolean | string | undefined }) {
  return (
    <img class="w-10 h-10 rounded-full" src={props.path as string} alt="" />
  );
}
