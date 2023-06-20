export function deepCopy(obj: object) {
  return JSON.parse(JSON.stringify(obj));
}

export function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error("Node expected");
  }
}

export function download(fileame: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileame;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export function clickOnButton(elt: HTMLElement) {
  if (elt.tagName === "BUTTON") {
    return true;
  } else {
    if (!elt.parentElement) {
      return false;
    }
    return clickOnButton(elt.parentElement);
  }
}
