import { Link } from '@tanstack/react-router'
import { CookingPot } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { recipes } from '@/data/recipes'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50 no-print">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
        >
          <CookingPot className="w-6 h-6 text-accent" />
          <span className="font-display text-xl tracking-wide font-medium">
            Rusty's Recipes
          </span>
        </Link>

        <Select defaultValue="pulla">
          <SelectTrigger className="w-[180px] border-border/60 bg-card/50">
            <SelectValue placeholder="Select recipe" />
          </SelectTrigger>
          <SelectContent>
            {recipes.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                {recipe.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
