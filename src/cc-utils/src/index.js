export * from './time';

export const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

export const weeks = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export const tables = {
  1001: 'assets',
  1002: 'project_assets',
  1003: 'org_assets',
  1004: 'user_balance',
  1005: 'user_allowance',
  1006: 'user_expense',
  1007: 'vendor_balance',
  1008: 'vendor_payments',
  1009: 'vendor_bills',
  1010: 'organizations',
  1011: 'user_orgs',
  1012: 'projects',
  1013: 'user_projects',
  1014: 'stocks',
  1015: 'grn',
  1016: 'purchased_order',
  1017: 'received_order',
  1018: 'task_categories',
  1019: 'tasks',
  1020: 'task_stocks',
  1021: 'users',
  1022: 'user_roles',
  1023: 'vendors',
  1024: 'org_vendors',
  1025: 'issues',
  1026: 'reports',
  1027: 'request_stocks',
  1028: 'labour_attendance',
  1029: 'labour_payments',
};

export const getPermissions = (pm, id) => {
  if (Array.isArray(id)) {
    const thisids = {};
    id.forEach(ids => {
      const m = (pm && pm.asObject && pm.asObject[ids]) || null;
      thisids[ids] = m;
    });
    return thisids;
  } else if (typeof id === 'number') {
    return (pm && pm.asObject && pm.asObject[id]) || null;
  }
};

export const handlePermissions = permissions => {
  const x = permissions.map(p => ({
    table_id: p.table_id,
    table_name: tables[p.table_id],
    ...JSON.parse(p.permission),
  }));
  return x;
};

export const handleTablePermissions = p => {
  return {
    table_id: p.table_id,
    table_name: tables[p.table_id],
    ...JSON.parse(p.permission),
  };
};

/* eslint-disable no-undef */
export const resizeImage = (inputFile, maxWidth = 1080, maxHeight = 1920) => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }

          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const resizedDataUrl = canvas.toDataURL('image/jpeg');

        resolve(resizedDataUrl);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(inputFile);
  });
};

export const appendZeroesToSixDigits = number => {
  // Convert the number to a string
  let numberString = number.toString();

  // Calculate the number of zeroes to append
  const zeroesToAdd = 6 - numberString.length;

  // Append zeroes to the front
  for (let i = 0; i < zeroesToAdd; i++) {
    numberString = '0' + numberString;
  }

  return numberString;
};

export const createBinaryTree = (data, tasks = []) => {
  // data, tasks
  // const data = jsonData
  // const tasks = taskData
  // Create a map to store nodes based on their group_id
  const nodeMap = new Map();

  // Create the root of the binary tree
  const root = {children: []};

  // Build the map of nodes and find the root node
  data.forEach(item => {
    const node = {
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
  data.forEach(item => {
    if (item.parent_id !== null) {
      const parent = nodeMap.get(item.parent_id);
      if (parent) {
        parent.children.push(nodeMap.get(item.group_id));
      }
    }
  });

  if (tasks) {
    // Map tasks to their respective group nodes
    tasks.forEach(task => {
      const groupNode = nodeMap.get(task.parent_id);
      if (groupNode) {
        groupNode.tasks.push(task);
      }
    });
  }

  return root.children;
};

export const calculateTotal = items => {
  let totalPrice = 0;
  let netPrice = 0;
  let discountPrice = 0;

  const newItems = items.map(item => {
    let currentItemPrice =
      (item.received > item.quantity ? item.received : item.quantity) *
      item.rate;
    netPrice += currentItemPrice;

    let currentItemDiscountPrice = 0;
    if (item.discount_price) {
      currentItemDiscountPrice = item.discount_price;
    } else if (item.discount_percent) {
      currentItemDiscountPrice =
        (item.discount_percent / 100) * currentItemPrice;
    }
    discountPrice += currentItemDiscountPrice;
    currentItemPrice -= currentItemDiscountPrice;
    totalPrice += currentItemPrice;

    return {
      ...item,
      totalPrice: currentItemPrice,
    };
  });
  let gst = (18 / 100) * totalPrice;
  totalPrice = totalPrice + gst;
  const returnValue = {
    totalPrice,
    netPrice,
    discountPrice,
    gstPrice: gst,
    newItems,
  };
  return returnValue;
};

export const createHookData = (key, items) => {
  const x = {};
  items.forEach(item => {
    x[item[key]] = item;
  });
  return {asArray: items, asObject: x};
};
