export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`font-extrabold tracking-[0.12em] text-ink ${small ? "text-base" : "text-lg"}`}>
        AG <span className="text-brand">CYBER</span> LAB
      </span>
      <span className="mt-1 text-[10px] font-semibold tracking-[0.28em] text-accent">LEARN • PRACTICE • SECURE</span>
    </span>
  );
}
