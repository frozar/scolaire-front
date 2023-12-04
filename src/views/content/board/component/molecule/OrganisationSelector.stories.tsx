import { Meta, StoryObj } from "storybook-solidjs";
import { OrganisationSelector } from "./OrganisationSelector";
import { SchoolsEnumerationProps } from "./SchoolsEnumeration";

const meta = {
  component: OrganisationSelector,
  tags: ["autodocs"],
} satisfies Meta<typeof OrganisationSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
  render: (props: SchoolsEnumerationProps) => {
    return <OrganisationSelector {...props} />;
  },

  args: {
    schoolsName: ["Ecole 1", "Ecole 2"],
  },
};
