import Link from "next/link";

export default function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-sm font-extrabold tracking-wider text-white">AG</span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-[0.12em] text-ink">AG CYBER LAB</span>
        <span className="block text-[10px] font-semibold tracking-[0.22em] text-accent">LEARN • PRACTICE • SECURE</span>
      </span>
    </Link>
  );
}
