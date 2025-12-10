import { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ChefHat, Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { recipes } from '@/data/recipes'

export default function Header() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/' })
  const currentRecipeId = search.recipe || 'pulla'
  const [open, setOpen] = useState(false)

  const visibleRecipes = recipes.filter((r) => !r.hidden)
  const currentRecipe = recipes.find((r) => r.id === currentRecipeId)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50 no-print">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          search={{ recipe: 'pulla' }}
          className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
        >
          <ChefHat className="w-6 h-6 text-accent" />
          <span className="font-display text-xl tracking-wide font-medium">
            Rusty's Recipes
          </span>
        </Link>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-32 sm:w-56 justify-between border-border/60 bg-card/50"
            >
              <span className="truncate">
                {currentRecipe?.label ?? 'Select recipe...'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <Command>
              <CommandInput placeholder="Search recipes..." />
              <CommandList>
                <CommandEmpty>No recipe found.</CommandEmpty>
                <CommandGroup>
                  {visibleRecipes.map((recipe) => (
                    <CommandItem
                      key={recipe.id}
                      value={recipe.label}
                      onSelect={() => {
                        navigate({ to: '/', search: { recipe: recipe.id } })
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          currentRecipeId === recipe.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {recipe.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
