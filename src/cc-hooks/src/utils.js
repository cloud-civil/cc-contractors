export const mapData = (payload, uid) => {
  const asObject = {}
  payload.data.forEach((item) => {
    asObject[item[uid]] = item
  })
  return {
    asArray: payload.data,
    asObject
  }
}

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
  1029: 'labour_payments'
}
