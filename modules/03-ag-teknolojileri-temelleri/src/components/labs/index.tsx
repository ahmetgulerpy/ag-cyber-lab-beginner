"use client";

import type { ComponentType } from "react";
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
import Lab11 from "./Lab11";
import Lab12 from "./Lab12";
import Lab13 from "./Lab13";
import Lab14 from "./Lab14";
import Lab15 from "./Lab15";
import Lab16 from "./Lab16";

const LABS: Record<number, ComponentType> = {
  1: Lab01, 2: Lab02, 3: Lab03, 4: Lab04, 5: Lab05, 6: Lab06, 7: Lab07, 8: Lab08,
  9: Lab09, 10: Lab10, 11: Lab11, 12: Lab12, 13: Lab13, 14: Lab14, 15: Lab15, 16: Lab16,
};

export function LabFor({ id }: { id: number }) {
  const C = LABS[id];
  return C ? <C /> : null;
}
