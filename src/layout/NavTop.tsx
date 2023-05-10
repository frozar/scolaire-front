import { CurrentUserLogo } from "../export/Logos";

export default function () {
  return (
    <>
      <nav class="w-full bg-[#062F3F] text-white h-[60px] flex  justify-end items-center pr-5">
        <CurrentUserLogo />
      </nav>
    </>
  );
}
