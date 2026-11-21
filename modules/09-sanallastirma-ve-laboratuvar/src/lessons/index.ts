import type { ComponentType } from "react";
import L01 from "./L01";
import L02 from "./L02";
import L03 from "./L03";
import L04 from "./L04";
import L05 from "./L05";
import L06 from "./L06";
import L07 from "./L07";
import L08 from "./L08";
import L09 from "./L09";
import L10 from "./L10";
import L11 from "./L11";

export const LESSON_COMPONENTS: Record<string, ComponentType> = {
  "virtualization-nedir": L01,
  "hypervisor-mantigi": L02,
  virtualbox: L03,
  vmware: L04,
  "sanal-makine-kurulumu": L05,
  "snapshot-ve-clone": L06,
  "nat-ve-bridged": L07,
  "izole-laboratuvar": L08,
  "kali-linux-kurulumu": L09,
  "ubuntu-kurulumu": L10,
  "laboratuvar-guvenligi": L11,
};
