import { Meta, StoryObj } from "storybook-solidjs";
import LabeledInputFieldComponent, {
  LabeledInputFieldProps,
} from "./LabeledInputField";

const meta = {
  component: LabeledInputFieldComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LabeledInputFieldComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: LabeledInputFieldProps) => {
    return <LabeledInputFieldComponent {...props} />;
  },

  args: {
    name: "input-id = name",
    value: "Input text value",
    placeholder: "Input placeholder",
  },

  argTypes: {
    onInput: () => {
      console.log("on input");
    },
  },
};
