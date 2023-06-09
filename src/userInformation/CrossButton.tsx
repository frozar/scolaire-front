import { removeUserInformation } from "../signaux";

export default function (props: { id: number }) {
  return (
    <button onClick={() => removeUserInformation(props.id)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
