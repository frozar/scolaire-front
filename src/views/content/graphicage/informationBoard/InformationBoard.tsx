// import { JSXElement } from "solid-js";
// import { Dynamic } from "solid-js/web";
// import { useStateGui } from "../../../../StateGui";
// import InformationCircleIcon from "../component/atom/InformationCircleIcon";
// import SettingsIcon from "../component/atom/SettingsIcon";
// import { InformationBoardTabType } from "../component/organism/InformationBoardTabs";
// import { SettingsContent } from "../component/organism/SettingsContent";
// import InformationContent from "./InformationContent";

// const [, { getInformationBoardSelectedTab, getDisplayedInformationBoard }] =
//   useStateGui();

// export function InformationBoard() {
//   let refMenuContent!: HTMLDivElement;

//   const tabs: (InformationBoardTabType & {
//     content: (props: object) => JSXElement;
//   })[] = [
//     {
//       id: "information",
//       label: "Informations",
//       icon: InformationCircleIcon,
//       content: InformationContent,
//     },
//     {
//       id: "settings",
//       label: "Paramètres",
//       icon: SettingsIcon,
//       content: SettingsContent,
//     },
//   ];

//   return (
//     <div
//       ref={refMenuContent}
//       class="menu__custom"
//       classList={{
//         active: getDisplayedInformationBoard(),
//       }}
//     >
//       <Dynamic
//         component={
//           tabs.find((tab) => tab.id === getInformationBoardSelectedTab())
//             ?.content
//         }
//       />
//     </div>
//   );
// }

// TODO To remove
