import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for our fake data
export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

export interface RecipeListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
}

// Fake API delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fake data
const fakeRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta.',
    ingredients: [
      '400g spaghetti',
      '200g pancetta or guanciale',
      '4 large eggs',
      '100g Pecorino Romano cheese',
      'Black pepper',
      'Salt'
    ],
    instructions: [
      'Cook spaghetti in salted boiling water until al dente',
      'Cut pancetta into small cubes and cook until crispy',
      'Beat eggs with grated cheese and black pepper',
      'Drain pasta and mix with pancetta',
      'Remove from heat and quickly mix in egg mixture',
      'Serve immediately with extra cheese'
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5'
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies.',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Mix flour, baking soda, and salt in a bowl',
      'Cream butter and both sugars until fluffy',
      'Beat in eggs and vanilla',
      'Gradually mix in flour mixture',
      'Stir in chocolate chips',
      'Drop rounded tablespoons onto ungreased baking sheets',
      'Bake 9-11 minutes until golden brown'
    ],
    prepTime: 20,
    cookTime: 11,
    servings: 24,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'
  },
  {
    id: 3,
    title: 'Beef Wellington',
    description: 'An elegant dish of beef tenderloin wrapped in puff pastry.',
    ingredients: [
      '2 lb beef tenderloin',
      '1 lb puff pastry',
      '8 oz mushrooms',
      '2 shallots',
      '2 cloves garlic',
      '2 tbsp Dijon mustard',
      '2 slices prosciutto',
      '1 egg yolk',
      'Salt and pepper'
    ],
    instructions: [
      'Season beef and sear on all sides',
      'Brush with mustard and let cool',
      'Sauté mushrooms, shallots, and garlic',
      'Roll out pastry and layer with prosciutto',
      'Wrap beef in mushroom mixture and pastry',
      'Brush with egg yolk and bake at 400°F for 25-30 minutes',
      'Rest before slicing'
    ],
    prepTime: 45,
    cookTime: 30,
    servings: 6,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d'
  }
];

// Create the API slice
export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fake-api.example.com/api/',
    // Simulate network delay
    prepareHeaders: async () => {
      await delay(1000); // 1 second delay
      return new Headers({
        'Content-Type': 'application/json',
      });
    },
  }),
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    // Get all recipes with pagination
    getRecipes: builder.query<RecipeListResponse, { page?: number; limit?: number }>({
      queryFn: async ({ page = 1, limit = 10 }) => {
        await delay(800); // Simulate API delay
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedRecipes = fakeRecipes.slice(startIndex, endIndex);
        
        return {
          data: {
            recipes: paginatedRecipes,
            total: fakeRecipes.length,
            page,
            limit
          }
        };
      },
      providesTags: ['Recipe'],
    }),
    
    // Get a single recipe by ID
    getRecipe: builder.query<Recipe, number>({
      queryFn: async (id) => {
        await delay(500); // Simulate API delay
        
        const recipe = fakeRecipes.find(r => r.id === id);
        if (!recipe) {
          return { error: { status: 404, data: 'Recipe not found' } };
        }
        
        return { data: recipe };
      },
      providesTags: (result, error, id) => [{ type: 'Recipe', id }],
    }),
    
    // Search recipes by title
    searchRecipes: builder.query<Recipe[], string>({
      queryFn: async (searchTerm) => {
        await delay(600); // Simulate API delay
        
        const filteredRecipes = fakeRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return { data: filteredRecipes };
      },
      providesTags: ['Recipe'],
    }),
    
    // Create a new recipe (fake implementation)
    createRecipe: builder.mutation<Recipe, Omit<Recipe, 'id'>>({
      queryFn: async (newRecipe) => {
        await delay(1000); // Simulate API delay
        
        const recipe: Recipe = {
          ...newRecipe,
          id: Math.max(...fakeRecipes.map(r => r.id)) + 1
        };
        
        fakeRecipes.push(recipe);
        
        return { data: recipe };
      },
      invalidatesTags: ['Recipe'],
    }),
    
    // Update a recipe (fake implementation)
    updateRecipe: builder.mutation<Recipe, Recipe>({
      queryFn: async (updatedRecipe) => {
        await delay(800); // Simulate API delay
        
        const index = fakeRecipes.findIndex(r => r.id === updatedRecipe.id);
        if (index === -1) {
          return { error: { status: 404, data: 'Recipe not found' } };
        }
        
        fakeRecipes[index] = updatedRecipe;
        
        return { data: updatedRecipe };
      },
      invalidatesTags: (result, error, recipe) => [{ type: 'Recipe', id: recipe.id }],
    }),
    
    // Delete a recipe (fake implementation)
    deleteRecipe: builder.mutation<{ success: boolean }, number>({
      queryFn: async (id) => {
        await delay(500); // Simulate API delay
        
        const index = fakeRecipes.findIndex(r => r.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Recipe not found' } };
        }
        
        fakeRecipes.splice(index, 1);
        
        return { data: { success: true } };
      },
      invalidatesTags: ['Recipe'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useSearchRecipesQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApi;
