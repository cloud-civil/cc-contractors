export const flattenData = json_data => {
  let result = [];
  for (let key in json_data) {
    result = result.concat(json_data[key]);
  }
  return result;
};

// dont fuck around with this code. You will only end up regretting.
export const groupTaskCategoriesForApp = allTaskCategories => {
  const taskCategoriesAsGroup = {
    main: [],
  };
  const taskCategoriesAsObject = {};
  allTaskCategories.forEach(category => {
    taskCategoriesAsObject[category.group_id] = category;
    taskCategoriesAsGroup[category.group_id] = [];
  });
  allTaskCategories.forEach(category => {
    if (!category.parent_id) {
      taskCategoriesAsGroup.main.push(category);
    } else {
      taskCategoriesAsGroup[category.parent_id].push(category);
    }
  });

  const r = {taskCategoriesAsGroup, taskCategoriesAsObject};
  return r;
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

export const getTaskCategoryStocks = task_stocks => {
  const x = {};
  task_stocks &&
    task_stocks.forEach(y => {
      if (!x[y.group_id]) {
        x[y.group_id] = [];
        x[y.group_id].push(y);
      } else {
        x[y.group_id].push(y);
      }
    });
  return x;
};
