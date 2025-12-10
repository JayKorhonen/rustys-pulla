import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Recipe } from '@/types/recipe'
import { Dot } from 'lucide-react'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="max-w-5xl mx-auto px-3 md:px-6 py-8 md:py-12">
      <Card className="relative overflow-hidden border-border/60 shadow-xl shadow-primary/5 bg-card">
        {/* Decorative inner border glow */}
        <div className="absolute inset-0 rounded-xl border border-white/40 pointer-events-none" />

        <CardContent className="p-6 md:p-10">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-wider uppercase text-primary mb-2">
              {recipe.title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground tracking-[0.12em] uppercase">
              {recipe.subtitle}
            </p>
          </header>

          {/* Flourish divider */}
          <div className="mx-auto w-full max-w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent mb-6" />

          {/* Description */}
          {recipe.description && (
            <>
              <p className="text-center text-foreground/90 leading-relaxed max-w-2xl mx-auto mb-6">
                {recipe.description}
              </p>
              {/* Flourish divider */}
              <div className="mx-auto w-full max-w-md h-px bg-gradient-to-r from-transparent via-accent to-transparent mb-8" />
            </>
          )}

          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8">
            {/* Ingredients column */}
            <section>
              <h2 className="font-display text-lg uppercase tracking-[0.16em] text-primary mb-4">
                Ingredients
              </h2>

              <div className="bg-gradient-to-br from-accent/5 to-white/80 border border-border/90 rounded-xl p-4 md:p-5">
                {recipe.ingredientGroups.map((group, idx) => (
                  <div key={group.title}>
                    <h3 className="text-sm uppercase tracking-[0.12em] text-muted-foreground mb-2 mt-4 first:mt-0">
                      {group.title}
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {group.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="text-[0.95rem] leading-relaxed text-foreground/90"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    {idx < recipe.ingredientGroups.length - 1 && (
                      <Separator className="my-4 bg-border/50" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions column */}
            <section>
              <h2 className="font-display text-lg uppercase tracking-[0.16em] text-primary mb-4">
                Instructions
              </h2>

              <ol className="list-decimal list-outside pl-5 space-y-3">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="text-[0.95rem] leading-relaxed">
                    <span className="font-semibold text-primary">
                      {step.title}:
                    </span>{' '}
                    <span className="text-foreground/90">
                      {step.description}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Footer note */}
          {recipe.footerNote && (
            <p className="mt-8 text-sm text-muted-foreground text-right italic">
              {recipe.footerNote}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Memorial */}
      <div className="mt-8 text-center text-sm text-muted-foreground space-y-1">
        <p>In loving memory of Rusty Korhonen</p>
        <p className="flex justify-center items-center gap-3">
          <a
            href="https://www.lynchandsonswaterford.com/obituaries/Jay-Rush-Korhonen?obId=46533004"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            Obituary
          </a>
          <span className="text-muted-foreground">
            <Dot className="w-4 h-4" />
          </span>
          <a
            href="https://www.youtube.com/@fe2o3yk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            YouTube
          </a>
          <span className="text-muted-foreground">
            <Dot className="w-4 h-4" />
          </span>
          <a
            href="https://donate.stripe.com/test_5kQ6oA7M18LC6aR4M92Fa00"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            Donate
          </a>
        </p>
      </div>
    </div>
  )
}
