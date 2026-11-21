import type { ComponentType } from "react";
import type { LabProps } from "../components/ui";
import Lab01 from "./Lab01";
import Lab02 from "./Lab02";
import Lab03 from "./Lab03";
import Lab04 from "./Lab04";
import Lab05 from "./Lab05";
import Lab06 from "./Lab06";
import Lab07 from "./Lab07";
import Lab08 from "./Lab08";
import Lab09 from "./Lab09";
import Lab10 from "./Lab10";

export const labs: Record<number, ComponentType<LabProps>> = {
  1: Lab01,
  2: Lab02,
  3: Lab03,
  4: Lab04,
  5: Lab05,
  6: Lab06,
  7: Lab07,
  8: Lab08,
  9: Lab09,
  10: Lab10,
};
