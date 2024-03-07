import {useEffect, useState} from 'react';

export const useTaskStatus = (tasks, project_id) => {
  const [__tasks, __setTasks] = useState({
    in_progress: [],
    delayed: [],
    up_coming: [],
    completed: [],
  });

  useEffect(() => {
    if (tasks && tasks[project_id]) {
      const projectTasks = tasks[project_id];
      const up_coming = [];
      const in_progress = [];
      const delayed = [];
      const completed = [];

      const today = new Date();
      const today_time = today.getTime();
      projectTasks.asArray.forEach(y => {
        const end_date = new Date(y.end_date);
        const start_date = new Date(y.start_date).getTime();
        const end_date_time = end_date.getTime();
        if (start_date > today_time) {
          up_coming.push(y);
        } else if (today_time > end_date_time && y.status !== 'completed') {
          delayed.push(y);
        } else if (today_time < end_date_time && y.status !== 'completed') {
          in_progress.push(y);
        }
      });
      const dd = {in_progress, up_coming, delayed, completed};
      __setTasks(dd);
    }
  }, [tasks]);

  return [__tasks, __setTasks];
};

export const useStocks = (task_stocks, activeGroupId) => {
  const taskStocks = (task_stocks && task_stocks[activeGroupId]) || null;
  const allStocks = {};
  // const allLimitStocks = {}
  const allStocksLimit = [];
  const allIssuedStocks = [];
  const allUsedStocks = [];
  taskStocks &&
    taskStocks.forEach(x => {
      if (!allStocks[x.stock_id]) {
        allStocks[x.stock_id] = {
          ...x,
          stockLimit: 0,
          stockIssued: 0,
          stockUsed: 0,
        };
      }
    });
  taskStocks &&
    taskStocks.forEach(x => {
      if (x.status === 99) {
        // allLimitStocks[x.stock_id] = x
        allStocksLimit.push(x);
      } else if (x.status === 101) {
        allIssuedStocks.push(x);
      } else if (x.status === 102) {
        allUsedStocks.push(x);
      }
    });

  allStocksLimit.forEach(x => {
    allStocks[x.stock_id].stockLimit += x.quantity;
  });

  allIssuedStocks.forEach(x => {
    allStocks[x.stock_id].stockIssued += x.quantity;
  });

  allUsedStocks.forEach(x => {
    allStocks[x.stock_id].stockUsed += x.quantity;
  });
  return {
    allStocks,
    allStocksLimit,
    // allLimitStocks,
    allIssuedStocks,
    allUsedStocks,
  };
};
