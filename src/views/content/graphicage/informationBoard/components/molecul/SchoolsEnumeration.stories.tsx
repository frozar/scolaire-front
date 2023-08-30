import { Meta, StoryObj } from "storybook-solidjs";
import SchoolsEnumerationComponent, {
  SchoolsEnumerationProps,
} from "./SchoolsEnumeration";

const meta = {
  component: SchoolsEnumerationComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof SchoolsEnumerationComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: SchoolsEnumerationProps) => {
    return <SchoolsEnumerationComponent {...props} />;
  },

  args: {
    schoolsName: ["Ecole 1", "Ecole 2"],
  },
};
