import { Meta, StoryObj } from "storybook-solidjs";
import ButtonComponent from "./Button";

const meta = {
  component: ButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonPrimary: Story = {
  args: {
    children: () => <span>Storybook test</span>,
    label: "Storybook test",
    onClickHandler: () => {
      console.log("call onClickHandler");
    },
    isDisabled: false,
  },
};

export const ButtonBorderless: Story = {
  args: {
    children: () => <span>Storybook test</span>,
    label: "Storybook test",
    onClickHandler: () => {
      console.log("call onClickHandler");
    },
    isDisabled: false,
    variant: "borderless",
  },
};
