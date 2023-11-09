import { createStore } from "solid-js/store";
import { Meta, StoryObj } from "storybook-solidjs";
import { NatureEnum } from "../../../../../type";
import { AssociatedItem } from "../molecule/CheckableElementList";
import { CheckableStopListBySchool } from "./CheckableStopListBySchool";

const meta = {
  component: CheckableStopListBySchool,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckableStopListBySchool>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  grades: [],
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
