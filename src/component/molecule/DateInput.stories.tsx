import { Meta, StoryObj } from "storybook-solidjs";
import { DateInput as DateInputComponent } from "./DateInput";

const meta = {
  component: DateInputComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof DateInputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const currentDate = new Date(Date.now());

export const DateInput: Story = {
  render: (props: {
    onChange: (date: Date) => void;
    label: string;
    minDate: Date;
    maxDate: Date;
    defaultValue: Date;
    disabled: boolean;
  }) => {
    return <DateInputComponent {...props} />;
  },

  args: {
    label: "Selecteur de date",
    maxDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    minDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    defaultValue: new Date(Date.now()),
    disabled: false,
  },
};
