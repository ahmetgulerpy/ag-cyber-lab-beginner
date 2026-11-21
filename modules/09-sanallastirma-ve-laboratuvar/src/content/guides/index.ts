import type { Guide } from "../types";
import { vboxInstall, vmwareInstall } from "./vbox-vmware";
import { vmCreate } from "./vm-create";
import { kaliA, kaliB } from "./kali";
import { ubuntuA } from "./ubuntu";

export const GUIDES: Record<string, Guide> = {
  "vbox-install": vboxInstall,
  "vmware-install": vmwareInstall,
  "vm-create": vmCreate,
  "kali-a": kaliA,
  "kali-b": kaliB,
  "ubuntu-a": ubuntuA,
};

export const GUIDE_LIST = Object.values(GUIDES);
export const TOTAL_GUIDE_STEPS = GUIDE_LIST.reduce((n, g) => n + g.steps.length, 0);
