import { Meta, StoryObj } from "storybook-solidjs";

import { createSignal } from "solid-js";
import CheckboxComponent from "./Checkbox";

const meta = {
  component: CheckboxComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
  document.createElement("input")
);

const [checkboxState, setCheckboxState] = createSignal(false);

function onChangeHandler(
  e: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  }
) {
  console.log("onChangeHandler");

  // Set the solid state of the checkbox accordingly to the state
  // of the HTML checkbox element
  setCheckboxState(e.target.checked);
  console.log("checkboxState()", checkboxState());

  // Set the state of the HTML checkbox element from a JS value
  refCheckbox().checked = checkboxState();
  console.log("refCheckbox().checked", refCheckbox().checked);
}

export const Checkbox: Story = {
  args: {
    ariaDescribedby: "etablissement-list",
    name: "etablissement",
    ref: setRefCheckbox,
    onChange: onChangeHandler,
  },
};

const [refCheckboxAlwaysTrue, setRefCheckboxAlwaysTrue] =
  createSignal<HTMLInputElement>(document.createElement("input"));

export const CheckboxAlwaysTrue: Story = {
  args: {
    ariaDescribedby: "etablissement-list",
    name: "etablissement",
    ref: setRefCheckboxAlwaysTrue,
    onChange: (
      e: Event & {
        currentTarget: HTMLInputElement;
        target: HTMLInputElement;
      }
    ) => {
      console.log("onChangeHandler");

      // Input state of the HTML checkbox element
      console.log("e.target.checked", e.target.checked);

      // Set the state of the HTML checkbox element to true
      refCheckboxAlwaysTrue().checked = true;
      console.log(
        "refCheckboxAlwaysTrue().checked",
        refCheckboxAlwaysTrue().checked
      );
    },
  },
};
