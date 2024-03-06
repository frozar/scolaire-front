import { createSignal } from "solid-js";
import { LineType } from "../_entities/line.entity";

export const [getLines, setLines] = createSignal<LineType[]>([]);

//TODO faire le namespace set, update, delete
