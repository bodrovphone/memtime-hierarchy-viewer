import type { TreeNodeType } from '@/types/memtime'

/**
 * Returns a human-readable label for a tree node type
 * @param type - The type of tree node (client, project, or task)
 * @returns The display label
 */
export function getNodeLabel(type: TreeNodeType): string {
  switch (type) {
    case 'client':
      return 'Client'
    case 'project':
      return 'Project'
    case 'task':
      return 'Task'
  }
}

/**
 * Calculates the indentation in pixels based on tree depth
 * @param depth - The depth level in the tree (0-based)
 * @param baseIndent - Base indentation per level (default: 24px)
 * @returns Indentation in pixels
 */
export function calculateIndent(
  depth: number,
  baseIndent: number = 24,
): number {
  return depth * baseIndent
}

/**
 * Determines if a tree node type can be expanded (has children)
 * @param type - The type of tree node
 * @returns true if the node can be expanded
 */
export function canNodeExpand(type: TreeNodeType): boolean {
  return type !== 'task'
}
