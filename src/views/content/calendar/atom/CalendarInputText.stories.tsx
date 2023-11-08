import { Setter } from "solid-js";
import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarInputText as CalendarInputTextComponent } from "./CalendarInputText";

const meta = {
  component: CalendarInputTextComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarInputTextComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarInputText: Story = {
  render: (props: {
    placeholder?: string;
    onInput: (value: string) => void;
    onKeyPress: (key: string) => void;
    ref?: Setter<HTMLInputElement>;
  }) => {
    return <CalendarInputTextComponent {...props} />;
  },

  args: {
    placeholder: "Placeholder of input",
  },
};
