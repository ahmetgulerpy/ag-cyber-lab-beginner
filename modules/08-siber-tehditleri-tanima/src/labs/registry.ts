import type { ComponentType } from "react";
import type { LabProps } from "./types";
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

export const LabRegistry: Record<string, ComponentType<LabProps>> = {
  "malware-nedir": Lab01,
  "virus-worm-trojan": Lab02,
  ransomware: Lab03,
  "spyware-keylogger": Lab04,
  phishing: Lab05,
  "social-engineering": Lab06,
  "brute-force": Lab07,
  ddos: Lab08,
  "man-in-the-middle": Lab09,
  "zero-day": Lab10,
  "insider-threat": Lab11,
  botnet: Lab12,
  "web-saldirilari": Lab13,
};
