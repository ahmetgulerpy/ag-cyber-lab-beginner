"use client";

import type { ComponentType } from "react";
import { Lab1, Lab2, Lab3 } from "./labs1";
import { Lab4, Lab5, Lab6 } from "./labs2";
import { Lab7, Lab8, Lab9 } from "./labs3";
import { Lab10, Lab11, Lab12a, Lab12b } from "./labs4";

function Lab12() {
  return (
    <div className="space-y-6">
      <Lab12a />
      <Lab12b />
    </div>
  );
}

export const LABS: Record<number, ComponentType> = {
  1: Lab1,
  2: Lab2,
  3: Lab3,
  4: Lab4,
  5: Lab5,
  6: Lab6,
  7: Lab7,
  8: Lab8,
  9: Lab9,
  10: Lab10,
  11: Lab11,
  12: Lab12,
};
