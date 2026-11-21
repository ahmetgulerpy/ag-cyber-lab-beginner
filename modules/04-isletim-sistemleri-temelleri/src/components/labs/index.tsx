"use client";
import type { ReactNode } from "react";
import LabShell from "@/components/LabShell";
import Lab01 from "./Lab01";
import Lab02 from "./Lab02";
import LabLinuxDesktop from "./LabLinuxDesktop";
import Lab04 from "./Lab04";
import Lab06 from "./Lab06";
import Lab07 from "./Lab07";
import Lab08 from "./Lab08";
import { LinuxTermLab, WinTermLab } from "./LabTerminals";
import Lab13 from "./Lab13";
import Lab14 from "./Lab14";

type Done = (id: string) => void;
const render = (id: number, done: Done): ReactNode => {
  switch (id) {
    case 1: return <Lab01 done={done} />;
    case 2: return <Lab02 done={done} />;
    case 3: return <LabLinuxDesktop variant="linux" done={done} />;
    case 4: return <Lab04 done={done} />;
    case 5: return <LabLinuxDesktop variant="kali" done={done} />;
    case 6: return <Lab06 done={done} />;
    case 7: return <Lab07 done={done} />;
    case 8: return <Lab08 done={done} />;
    case 9: return <LinuxTermLab mode="09" done={done} />;
    case 10: return <WinTermLab mode="10" done={done} />;
    case 11: return <LinuxTermLab mode="11" done={done} />;
    case 12: return <WinTermLab mode="12" done={done} />;
    case 13: return <Lab13 done={done} />;
    default: return <Lab14 done={done} />;
  }
};

export default function LabFor({ id }: { id: number }) {
  return <LabShell lesson={id}>{({ done }) => render(id, done)}</LabShell>;
}
