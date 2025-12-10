/**
 * Script to parse RecipeKeeper HTML export and convert to our Recipe format
 *
 * Usage: npx tsx scripts/parse-recipekeeper.ts <path-to-recipes.html>
 */

import { JSDOM } from 'jsdom'
import * as fs from 'fs'
import * as path from 'path'

interface IngredientGroup {
  title: string
  items: string[]
}

interface InstructionStep {
  title: string
  description: string
}

interface Recipe {
  id: string
  label: string
  title: string
  subtitle: string
  description: string
  ingredientGroups: IngredientGroup[]
  instructions: InstructionStep[]
  footerNote?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function decodeHtmlEntities(text: string): string {
  const dom = new JSDOM(`<!DOCTYPE html><body>${text}</body>`)
  return dom.window.document.body.textContent || text
}

function parseInstructions(directionsDiv: Element): InstructionStep[] {
  const paragraphs = directionsDiv.querySelectorAll('p')
  const steps: InstructionStep[] = []
  let currentStep = ''

  paragraphs.forEach((p) => {
    const text = p.textContent?.trim() || ''
    if (text) {
      currentStep += (currentStep ? ' ' : '') + text
    } else if (currentStep) {
      // Empty paragraph acts as separator between steps
      steps.push({
        title: `Step ${steps.length + 1}`,
        description: currentStep,
      })
      currentStep = ''
    }
  })

  // Don't forget the last step
  if (currentStep) {
    steps.push({
      title: `Step ${steps.length + 1}`,
      description: currentStep,
    })
  }

  // If no empty paragraphs were used as separators, treat each paragraph as a step
  if (steps.length === 0) {
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || ''
      if (text) {
        steps.push({
          title: `Step ${steps.length + 1}`,
          description: text,
        })
      }
    })
  }

  return steps
}

function parseIngredients(ingredientsDiv: Element): IngredientGroup[] {
  const paragraphs = ingredientsDiv.querySelectorAll('p')
  const items: string[] = []

  paragraphs.forEach((p) => {
    const text = p.textContent?.trim() || ''
    if (text) {
      items.push(text)
    }
  })

  if (items.length === 0) {
    return []
  }

  return [
    {
      title: 'Ingredients',
      items,
    },
  ]
}

function parseRecipe(recipeDiv: Element): Recipe {
  // Get recipe name
  const nameEl = recipeDiv.querySelector('[itemprop="name"]')
  const name = nameEl?.textContent?.trim() || 'Untitled Recipe'

  // Get recipe ID from meta tag
  const idMeta = recipeDiv.querySelector('[itemprop="recipeId"]')
  const originalId = idMeta?.getAttribute('content') || ''
  const id = slugify(name) || originalId

  // Get course/category for subtitle
  const courseEl = recipeDiv.querySelector('[itemprop="recipeCourse"]')
  const course = courseEl?.textContent?.trim() || ''

  // Get source for potential description
  const sourceEl = recipeDiv.querySelector('[itemprop="recipeSource"]')
  const source = sourceEl?.textContent?.trim() || ''

  // Get serving size
  const servingEl = recipeDiv.querySelector('[itemprop="recipeYield"]')
  const servingSize = servingEl?.textContent?.trim() || ''

  // Get prep time
  const prepTimeEl = recipeDiv.querySelector('[itemprop="prepTime"]')
  const prepTime = prepTimeEl?.getAttribute('content') || ''

  // Get cook time
  const cookTimeEl = recipeDiv.querySelector('[itemprop="cookTime"]')
  const cookTime = cookTimeEl?.getAttribute('content') || ''

  // Get ingredients
  const ingredientsDiv = recipeDiv.querySelector(
    '[itemprop="recipeIngredients"]',
  )
  const ingredientGroups = ingredientsDiv
    ? parseIngredients(ingredientsDiv)
    : []

  // Get directions
  const directionsDiv = recipeDiv.querySelector('[itemprop="recipeDirections"]')
  const instructions = directionsDiv ? parseInstructions(directionsDiv) : []

  // Get notes
  const notesDiv = recipeDiv.querySelector('[itemprop="recipeNotes"]')
  const notes = notesDiv?.textContent?.trim() || ''

  // Build subtitle from course and serving info
  let subtitle = course
  if (servingSize) {
    subtitle += subtitle ? ` • ${servingSize}` : servingSize
  }

  // Format times for description
  const timeInfo: string[] = []
  if (prepTime && prepTime !== 'PT0S') {
    timeInfo.push(`Prep: ${formatDuration(prepTime)}`)
  }
  if (cookTime && cookTime !== 'PT0S') {
    timeInfo.push(`Cook: ${formatDuration(cookTime)}`)
  }

  let description = timeInfo.join(' | ')
  if (source) {
    description += description ? ` • Source: ${source}` : `Source: ${source}`
  }

  return {
    id,
    label: name,
    title: name,
    subtitle: subtitle || 'Recipe',
    description: description || 'Imported from RecipeKeeper',
    ingredientGroups,
    instructions,
    ...(notes ? { footerNote: notes } : {}),
  }
}

function formatDuration(isoDuration: string): string {
  // Parse ISO 8601 duration format (e.g., PT1H30M, PT20M)
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return isoDuration

  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')

  const parts: string[] = []
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)

  return parts.join(' ') || '0m'
}

function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function generateRecipeCode(recipe: Recipe, varName: string): string {
  const ingredientGroupsStr = recipe.ingredientGroups
    .map(
      (group) =>
        `    {\n      title: '${escapeString(group.title)}',\n      items: [\n${group.items.map((item) => `        '${escapeString(item)}',`).join('\n')}\n      ],\n    }`,
    )
    .join(',\n')

  const instructionsStr = recipe.instructions
    .map(
      (step) =>
        `    {\n      title: '${escapeString(step.title)}',\n      description:\n        '${escapeString(step.description)}',\n    }`,
    )
    .join(',\n')

  let code = `export const ${varName}: Recipe = {
  id: '${escapeString(recipe.id)}',
  label: '${escapeString(recipe.label)}',
  title: '${escapeString(recipe.title)}',
  subtitle: '${escapeString(recipe.subtitle)}',
  description:\n    '${escapeString(recipe.description)}',
  ingredientGroups: [
${ingredientGroupsStr}
  ],
  instructions: [
${instructionsStr}
  ],`

  if (recipe.footerNote) {
    code += `\n  footerNote: '${escapeString(recipe.footerNote)}',`
  }

  code += '\n}'

  return code
}

function toVarName(name: string): string {
  // Convert recipe name to valid JS variable name
  let base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word, i) =>
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('')

  // Ensure variable name doesn't start with a number
  if (/^\d/.test(base)) {
    base = 'recipe' + base.charAt(0).toUpperCase() + base.slice(1)
  }

  return base + 'Recipe'
}

async function main() {
  const inputPath =
    process.argv[2] ||
    '/Users/jaykorhonen/Downloads/RecipeKeeper_20251209_222307/recipes.html'

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`)
    process.exit(1)
  }

  console.log(`Parsing recipes from: ${inputPath}`)

  const html = fs.readFileSync(inputPath, 'utf-8')
  const dom = new JSDOM(html)
  const document = dom.window.document

  const recipeDivs = document.querySelectorAll('.recipe-details')
  console.log(`Found ${recipeDivs.length} recipes`)

  const recipes: Recipe[] = []
  const varNames: string[] = []
  const usedVarNames = new Set<string>()

  recipeDivs.forEach((div, index) => {
    try {
      const recipe = parseRecipe(div)
      recipes.push(recipe)

      // Generate unique variable name
      let varName = toVarName(recipe.label)
      let counter = 2
      const baseVarName = varName
      while (usedVarNames.has(varName)) {
        varName = `${baseVarName}${counter}`
        counter++
      }
      usedVarNames.add(varName)
      varNames.push(varName)

      console.log(`  ${index + 1}. ${recipe.title}`)
    } catch (error) {
      console.error(`  Error parsing recipe ${index + 1}:`, error)
    }
  })

  // Generate the output file
  let output = `// Auto-generated from RecipeKeeper export
// Generated on: ${new Date().toISOString()}

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
  description: string
  ingredientGroups: IngredientGroup[]
  instructions: InstructionStep[]
  footerNote?: string
}

`

  // Add each recipe
  recipes.forEach((recipe, index) => {
    output += generateRecipeCode(recipe, varNames[index]) + '\n\n'
  })

  // Add the recipes array
  output += `export const importedRecipes: Recipe[] = [\n${varNames.map((name) => `  ${name},`).join('\n')}\n]\n`

  const outputPath = path.join(
    path.dirname(inputPath),
    '..',
    'Documents',
    'Rusty',
    'webapp',
    'src',
    'data',
    'imported-recipes.ts',
  )

  // Actually write to the project
  const projectOutputPath =
    '/Users/jaykorhonen/Documents/Rusty/webapp/src/data/imported-recipes.ts'
  fs.writeFileSync(projectOutputPath, output)
  console.log(`\nWrote ${recipes.length} recipes to: ${projectOutputPath}`)
}

main().catch(console.error)
