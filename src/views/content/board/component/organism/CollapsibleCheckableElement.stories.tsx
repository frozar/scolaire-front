import { JSXElement } from "solid-js";
import { createStore } from "solid-js/store";
import { Meta, StoryObj } from "storybook-solidjs";
import { NatureEnum } from "../../../../../type";
import CollapsibleCheckableElement, {
  AssociatedItem,
} from "./CollapsibleCheckableElement";

const meta = {
  component: CollapsibleCheckableElement,
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleCheckableElement>;

export default meta;
type Story = StoryObj<typeof meta>;

const children: JSXElement = (
  <ul>
    <li>Milk</li>
    <li>
      Cheese
      <ul>
        <li>Blue cheese</li>
        <li>Feta</li>
      </ul>
    </li>
  </ul>
);

const school = {
  id: 1,
  name: "school_test",
  lon: 3,
  lat: 3,
  associated: [
    {
      id: 1,
      name: "Ecole 1",
      quantity: 10,
    },
  ],
  nature: NatureEnum.school,
  classes: [],
  leafletId: 1,
};
const [stopSelected, setStopSelected] = createStore<AssociatedItem[]>(
  school.associated.map((elem) => {
    return { associated: elem, done: true };
  })
);

export const InformationBoardButton: Story = {
  args: {
    school,
    stopSelected,
    setStopSelected,
  },
};
