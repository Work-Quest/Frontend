import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Categorize items by color based on item name
 * @param itemName - The name of the item
 * @returns Color category: 'blue' | 'green' | 'red' | 'gray'
 */
export function getItemColorCategory(itemName: string): 'blue' | 'green' | 'red' | 'gray' {
  const name = itemName.toLowerCase().trim()
  
  // Blue category
  if (name === 'guard potion' || name === 'titan shield' || name === 'iron skin elixir') {
    return 'blue'
  }
  
  // Green category
  if (name === 'recovery potion' || name === 'life essence') {
    return 'green'
  }
  
  // Red category
  if (name === 'dragon fury' || name === 'strength potion' || name === 'battle elixir') {
    return 'red'
  }
  
  // Default gray for unknown items
  return 'gray'
}