import { Meta, StoryObj } from "storybook-solidjs";
import CellItemComponent from "./CellItem";

const meta = {
  component: CellItemComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CellItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NormalCellItem: Story = {
  render: (props: {
    isWeekend: boolean;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return <CellItemComponent {...props} />;
  },

  args: {
    isWeekend: false,
    isActive: false,
    onClick: () => {
      console.log("Cell click");
    },
  },
};

export const WeekendCellItem: Story = {
  render: (props: {
    isWeekend: boolean;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return <CellItemComponent {...props} />;
  },

  args: {
    isWeekend: true,
    isActive: false,
    onClick: () => {
      console.log("Cell click");
    },
  },
};

export const ActiveCellItem: Story = {
  render: (props: {
    isWeekend: boolean;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return <CellItemComponent {...props} />;
  },

  args: {
    isWeekend: false,
    isActive: true,
    onClick: () => {
      console.log("Cell click");
    },
  },
};
