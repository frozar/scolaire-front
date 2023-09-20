import { JSXElement } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";
import CollapsibleElement from "./CollapsibleElement";

const meta = {
  component: CollapsibleElement,
  tags: ["autodocs"],
} satisfies Meta<typeof CollapsibleElement>;

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

const title = "test";
export const InformationBoardButton: Story = {
  args: {
    children,
    title,
  },
};
