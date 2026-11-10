import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground select-none">
      <TextShimmerWave
        as="div"
        className="font-serif text-[28px] tracking-tight leading-none"
        duration={1.4}
        spread={1.1}
        zDistance={8}
        scaleDistance={1.08}
        rotateYDistance={8}
      >
        <span className="text-muted-foreground/60 dark:text-muted-foreground/50">
          Apply
        </span>
        <span className="serif-accent text-primary/70">
          Flow
        </span>
      </TextShimmerWave>
    </div>
  )
}
