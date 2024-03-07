import {groupStocks, groupStockCategories} from './utils';
import {createBinaryTree} from '../../../utils/createBinaryTree';

export const useHooks = (project_id, app, stock) => {
  const {stocks, stock_groups} = stock;
  const {
    isMobile,
    vendors,
    porders: purchased_orders,
    rorders: received_orders,
    user_roles,
    reRender,
  } = app;
  const stocksAsArray =
    (stocks[project_id] && stocks[project_id].asArray) || [];
  const stockGroupsAsArray =
    (stock_groups[project_id] && stock_groups[project_id].asArray) || [];
  const stocksObject =
    (stocks[project_id] && stocks[project_id].asObject) || [];
  const purchasedOrders =
    (purchased_orders[project_id] && purchased_orders[project_id].asArray) ||
    [];
  const receivedOrders =
    (received_orders[project_id] && received_orders[project_id].asArray) || [];
  const userRoles =
    (user_roles[project_id] && user_roles[project_id].asArray) || [];
  const vendorsAsObject = vendors.asObject;
  const vendorss = vendors.asArray;
  const {
    stockCategoriesAsGroup,
    stockCategoriesAsObject,
    stockCategoriesAsArray,
  } = groupStockCategories(stockGroupsAsArray);

  const groupStocks_ = groupStocks(stocksAsArray);
  const binaryTreeStocks = createBinaryTree(stockGroupsAsArray);

  return {
    stocks: stocksAsArray,
    binaryTreeStocks,
    groupStocks: groupStocks_,
    stockGroups: stockGroupsAsArray,
    stockCategoriesAsGroup,
    stockCategoriesAsObject,
    stockCategoriesAsArray,
    stocksObject,
    purchasedOrders,
    receivedOrders,
    userRoles,
    reRender,
    isMobile,
    vendorsAsObject,
    vendors: vendorss,
  };
};
