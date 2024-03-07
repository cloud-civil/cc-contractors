export const GroupTaskCategories = data => {
  const o = {
    main: <any>[],
  };
  const x = {};

  data.forEach(x => {
    o[x.group_id] = <any>[];
  });

  data.forEach(g => {
    x[g.group_id] = g;
    if (!g.parent_id) {
      o.main.push(g);
    }
    if (g.parent_id) {
      o[g.parent_id].push(g);
    }
  });
  const z = {task_categories_group: o, all_task_groups: x};
  return z;
};

export const getGroupTasks = tasks => {
  const x = {};
  tasks.forEach(y => {
    if (!x[y.parent_id]) {
      x[y.parent_id] = [];
      x[y.parent_id].push(y);
    } else {
      x[y.parent_id].push(y);
    }
  });
  return x;
};

export const getTaskCategoryStocks = (task_stocks: any) => {
  const x = {};
  task_stocks.forEach((y: any) => {
    if (!x[y.group_id]) {
      x[y.group_id] = [];
      x[y.group_id].push(y);
    } else {
      x[y.group_id].push(y);
    }
  });
  return x;
};

export const createBinaryTree = (data: any, tasks: any) => {
  // data, tasks
  // const data = jsonData
  // const tasks = taskData
  // Create a map to store nodes based on their group_id
  const nodeMap = new Map();

  // Create the root of the binary tree
  const root = {children: <any>[]};

  // Build the map of nodes and find the root node
  data.forEach((item: any) => {
    const node: any = {
      ...item,
      children: [],
      tasks: [],
    };
    nodeMap.set(node.group_id, node);

    if (item.parent_id === null) {
      root.children.push(node);
    }
  });

  // Connect child nodes to their parent nodes
  data.forEach((item: any) => {
    if (item.parent_id !== null) {
      const parent = nodeMap.get(item.parent_id);
      if (parent) {
        parent.children.push(nodeMap.get(item.group_id));
      }
    }
  });

  // Map tasks to their respective group nodes
  if (tasks) {
    tasks.forEach((task: any) => {
      const groupNode = nodeMap.get(task.parent_id);
      if (groupNode) {
        groupNode.tasks.push(task);
      }
    });
  }

  return root.children;
};
