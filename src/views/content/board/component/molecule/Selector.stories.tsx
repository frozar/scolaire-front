import { Meta, StoryObj } from "storybook-solidjs";
import { Selector } from "./Selector";

const meta = {
  component: Selector,
  tags: ["autodocs"],
} satisfies Meta<typeof Selector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props) => {
    return <Selector {...props} />;
  },

  args: {
    selectorTitle: "Titre",
    content: [
      { value: 1, name: "Ecole 1" },
      { value: 2, name: "Ecole 2" },
    ],
    disabled: false,
    selectedValue: 2,
    onChange: (
      res: Event & {
        currentTarget: HTMLSelectElement;
        target: HTMLSelectElement;
      }
    ) => {
      console.log(res);
      console.log("Value", res.target.value);
    },
  },
};
