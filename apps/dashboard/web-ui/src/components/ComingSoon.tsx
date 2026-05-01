interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-text-base">{title}</h2>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-border text-text-muted uppercase tracking-wide">
          Coming Soon
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-border bg-surface-alt/50 px-6 py-10 flex flex-col items-center gap-3 text-center select-none">
        <div className="w-10 h-10 rounded-full bg-border/60 flex items-center justify-center">
          <svg className="w-5 h-5 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-text-muted font-medium">準備中 / In development</p>
        {description && <p className="text-xs text-text-muted max-w-sm">{description}</p>}
      </div>
    </section>
  );
}
