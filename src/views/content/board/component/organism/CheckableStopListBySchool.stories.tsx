import { createSignal } from "solid-js";
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
      gradeId: 1,
    },
  ],
  nature: NatureEnum.school,
  grades: [{ id: 1 }],
  leafletId: 1,
};
const [checkableStop, setCheckableStop] = createSignal<AssociatedItem[]>(
  school.associated.map((elem) => {
    return { item: { ...elem, associated: [{ gradeId: 1 }] }, done: false };
  })
);

export const InformationBoardButton: Story = {
  args: {
    school,
    checkableStop,
    setCheckableStop,
  },
};
