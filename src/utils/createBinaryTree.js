/* eslint-disable no-undef */
export const createBinaryTree = (data) => {
  // Create a map to store nodes based on their group_id
  const nodeMap = new Map()

  // Create the root of the binary tree
  const root = { children: [] }

  // Build the map of nodes and find the root node
  data.forEach((item) => {
    const node = {
      ...item,
      children: [],
    }
    nodeMap.set(node.group_id, node)

    if (item.parent_id === null) {
      root.children.push(node)
    }
  })

  // Connect child nodes to their parent nodes
  data.forEach((item) => {
    if (item.parent_id !== null) {
      const parent = nodeMap.get(item.parent_id)
      if (parent) {
        parent.children.push(nodeMap.get(item.group_id))
      }
    }
  })

  return root.children
}
