import { Meta, StoryObj } from "storybook-solidjs";
import { CalendarSectionTitle as CalendarSectionTitleComponent } from "./CalendarSectionTitle";

const meta = {
  component: CalendarSectionTitleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CalendarSectionTitleComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CalendarSectionTitle: Story = {
  render: (props: { title: string; greenTitle: string }) => {
    return <CalendarSectionTitleComponent {...props} />;
  },

  args: {
    title: "Titre de section",
  },
};

export const CalendarSectionTitleGreenPart: Story = {
  render: (props: { title: string; greenTitle: string }) => {
    return <CalendarSectionTitleComponent {...props} />;
  },

  args: {
    title: "Titre de section",
    greenTitle: "green part",
  },
};
