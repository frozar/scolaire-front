import { Meta, StoryObj } from "storybook-solidjs";
import { ColorPicker } from "./ColorPicker";

const meta = {
  component: ColorPicker,
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker>;

// const icon = SettingsIcon;

// const icons = {
//   SettingsIcon,
//   InformationCircleIcon,
// };

export default meta;
type Story = StoryObj<typeof meta>;

const onChange = (color: string) => console.log("color onChange : " + color);
const onInput = (color: string) => console.log("color onInput : " + color);

export const ColorPickerStory: Story = {
  args: {
    color: "#f3e6aa",
    title: "Couleur de la ligne",
    onInput: onInput,
    onChange: onChange,
  },
};
