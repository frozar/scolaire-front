import { Meta, StoryObj } from "storybook-solidjs";
import { For, createSignal } from "solid-js";

import EtablissementItem from "../../EtablissementItem";
import TableBodyComponent from "./TableBody";

const meta = {
  component: TableBodyComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TableBodyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [items, setItems] = createSignal([
  {
    id: 1,
    name: "Ecole DE BEAUMONT",
    quantity: 149,
    nbLine: 0,
    lon: 1,
    lat: 1,
    selected: false,
  },
  {
    id: 2,
    name: "Ecole DE BEAUMONT",
    quantity: 14,
    nbLine: 0,
    lon: 1,
    lat: 1,
    selected: false,
  },
]);

export const Body: Story = {
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
