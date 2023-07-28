import { Meta, StoryObj } from "storybook-solidjs";
import BuildLineButtonComponent from "./BuildLineButton";

const meta = {
  component: BuildLineButtonComponent,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: {
        type: "boolean",
      },
    },
  },
} satisfies Meta<typeof BuildLineButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonPrimary: Story = {
  args: {
    onClickHandler: () => {
      console.log("call onClickHandler");
    },
    disabled: false,
  },
};
