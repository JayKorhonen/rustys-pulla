export interface IngredientGroup {
  title: string
  items: string[]
}

export interface InstructionStep {
  title: string
  description: string
}

export interface Recipe {
  id: string
  label: string
  title: string
  subtitle: string
  description?: string
  ingredientGroups: IngredientGroup[]
  instructions: InstructionStep[]
  footerNote?: string
  hidden?: boolean
}
