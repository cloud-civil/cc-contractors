export const handleMoveStockToGroup = (stocks, submitData) => {
  const newStocks = stocks.map(x => {
    if (x.stock_id === submitData.stock_id) {
      return {...x, sgroup_id: submitData.sgroup_id};
    }
    return x;
  });
  const ob = {};
  newStocks.forEach(x => {
    ob[x.stock_id] = x;
  });
  return {
    asArray: newStocks,
    asObject: ob,
  };
};

export const groupStockCategories = allStockGroups => {
  const stockCategoriesAsGroup = {
    main: [],
  };
  const stockCategoriesAsObject = {};

  allStockGroups.forEach(category => {
    stockCategoriesAsObject[category.group_id] = category;
    stockCategoriesAsGroup[category.group_id] = [];
    if (!category.parent_id) {
      stockCategoriesAsGroup.main.push(category);
    }
    if (category.parent_id) {
      stockCategoriesAsGroup[category.parent_id].push(category);
    }
  });
  return {
    stockCategoriesAsGroup,
    stockCategoriesAsObject,
    stockCategoriesAsArray: allStockGroups,
  };
};

export const groupStocks = stocks => {
  const x = {
    main: [],
  };
  stocks.forEach(y => {
    if (!y.sgroup_id) {
      x.main.push(y);
    } else if (y.sgroup_id && !x[y.sgroup_id]) {
      x[y.sgroup_id] = [];
      x[y.sgroup_id].push(y);
    } else {
      x[y.sgroup_id].push(y);
    }
  });
  return x;
};
