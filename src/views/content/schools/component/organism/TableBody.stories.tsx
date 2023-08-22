import { For, createSignal } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";

import { NatureEnum } from "../../../../../type";
import EtablissementItem from "../../SchoolItem";
import TableBodyComponent from "./TableBody";

const meta = {
  component: TableBodyComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableBodyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [selected, setSelected] = createSignal(false);
const [items, setItems] = createSignal([
  {
    leafletId: 1,
    id: 1,
    name: "Ecole DE BEAUMONT",
    lon: 1,
    lat: 1,
    selected: selected,
    setSelected: setSelected,
    quantity: 0,
    nature: NatureEnum.school,
    associated: [
      {
        id: 2,
        name: "Stop 2",
        quantity: 3,
      },
    ],
  },
  {
    leafletId: 1,
    id: 2,
    name: "Ecole DE BEAUMONT",
    lon: 1,
    lat: 1,
    selected: selected,
    setSelected: setSelected,
    quantity: 0,
    nature: NatureEnum.school,
    associated: [
      {
        id: 1,
        name: "Stop 1",
        quantity: 4,
      },
      {
        id: 2,
        name: "Stop 2",
        quantity: 9,
      },
    ],
  },
]);

export const TableBodyStory: Story = {
  args: {
    children: () => (
      <For each={items()}>
        {(fields) => {
          return (
            <EtablissementItem item={fields} setEtablissements={setItems} />
          );
        }}
      </For>
    ),
  },
};
