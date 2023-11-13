import { Meta, StoryObj } from "storybook-solidjs";
import { TextInput as TextInputComponent } from "./TextInput";
const meta = {
  component: TextInputComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof TextInputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: (props: {
    onInput: () => void;
    defaultValue: string;
    placeholder: string;
    disabled: boolean;
  }) => {
    return <TextInputComponent {...props} />;
  },

  args: {
    placeholder: "Entrer de texte",
  },
};

export const TextInputDisabled: Story = {
  render: (props: {
    placeholder: string;
    disabled: boolean;
    onInput: () => void;
    defaultValue: string;
  }) => {
    return <TextInputComponent {...props} />;
  },

  args: {
    placeholder: "Entrer de texte",
    disabled: true,
  },
};
