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

export const pullaRecipe: Recipe = {
  id: 'pulla',
  label: 'Pulla',
  title: "Rusty's Pulla",
  subtitle: 'Finnish Coffee Bread for Braiding & Sharing',
  description:
    'Do not expect pulla to be light and fluffy, this is a moist, rich coffee bread. It is traditionally served without butter, and is a delight when served hot. A straight braid is standard for pulla, but the braids can be shaped into a wreath for special occasions.',
  ingredientGroups: [
    {
      title: 'Dough',
      items: [
        '1 package active dry yeast',
        '½ cup warm water',
        '2 cups milk, scalded and cooled to lukewarm',
        '≤ 1 cup sugar',
        '1 teaspoon salt',
        '1 teaspoon ground cardamom (~7–8 pods)',
        '4 eggs, beaten',
        '8–9 cups sifted white flour',
        '½ cup melted butter',
      ],
    },
    {
      title: 'Glaze',
      items: ['1 beaten egg', 'Optional: sliced almonds or sugar'],
    },
  ],
  instructions: [
    {
      title: 'Prepare the yeast',
      description:
        'Dissolve yeast in ½ cup warm water. Let sit briefly, then add sugar, salt, cardamom, and beaten eggs.',
    },
    {
      title: 'Start the batter',
      description:
        'Add 2 cups of flour and beat until the batter becomes smooth and elastic.',
    },
    {
      title: 'Add more flour',
      description:
        'Add the next 3 cups of flour and beat until smooth and glossy.',
    },
    {
      title: 'Add butter',
      description: 'Add the melted butter and beat again until glossy.',
    },
    {
      title: 'Add remaining flour',
      description: 'Add the final 3–4 cups of flour until a stiff dough forms.',
    },
    {
      title: 'Rest',
      description:
        'Cover dough with an inverted mixing bowl and let rest 15 minutes.',
    },
    {
      title: 'Knead',
      description:
        'Knead until smooth and satiny. Place in a lightly greased bowl, turn dough to grease the top, cover, and let rise until doubled (about 1 hour).',
    },
    {
      title: 'Second rise',
      description:
        'Punch down and let rise again until almost doubled (about 30 minutes).',
    },
    {
      title: 'Shape',
      description:
        'Turn onto a lightly floured board. Divide into 3 equal portions, then divide each portion into 3 strips. Roll each strip to about 16 inches and braid. Pinch and tuck ends under.',
    },
    {
      title: 'Final rise',
      description:
        'Place braids on lightly greased baking sheets. Let rise for 20 minutes—puffy but not doubled.',
    },
    {
      title: 'Glaze',
      description:
        'Brush with beaten egg. Optional: sprinkle almonds or sugar.',
    },
    {
      title: 'Bake',
      description:
        'Bake at 400°F for 25–30 minutes until lightly browned. Do not overbake; pulla dries easily.',
    },
  ],
  footerNote: "Rusty's pulla recipe — adjust sugar and cardamom to taste.",
}

export const recipes: Recipe[] = [pullaRecipe]
