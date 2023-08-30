import { AiOutlinePlus } from "solid-icons/ai";
import { Meta, StoryObj } from "storybook-solidjs";
import ButtonIconComponent, { ButtonIconProps } from "./ButtonIcon";

const meta = {
  component: ButtonIconComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonIconComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: ButtonIconProps) => {
    return <ButtonIconComponent {...props} />;
  },

  args: {
    icon: <AiOutlinePlus />,
    class: "Entrer un classe",
  },

  argTypes: {
    onClick: () => {
      console.log("clicked");
    },
  },
};
