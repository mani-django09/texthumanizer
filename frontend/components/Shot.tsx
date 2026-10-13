/**
 * A real product screenshot in a browser-style frame. Images live in
 * /public/images as pre-sized WebP pairs (`name-800.webp`, `name-1280.webp`),
 * so no runtime image optimizer is needed. Width/height are set to reserve
 * space and avoid layout shift.
 */
export default function Shot({
  name,
  alt,
  width,
  height,
  caption,
  priority = false,
  url = 'texthumanizer.site',
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  url?: string;
}) {
  return (
    <figure className="relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-violet-500/15 to-cyan-500/15 blur-3xl rounded-[3rem] pointer-events-none" aria-hidden />
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-premium dark:shadow-premium-dark">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/70 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/70">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 flex-1 max-w-xs truncate text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1">
            {url}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/${name}-1280.webp`}
          srcSet={`/images/${name}-800.webp 800w, /images/${name}-1280.webp 1280w`}
          sizes="(max-width: 900px) 100vw, 900px"
          width={width}
          height={height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="relative mt-4 text-center text-xs text-slate-400 dark:text-slate-500">{caption}</figcaption>
      )}
    </figure>
  );
}
