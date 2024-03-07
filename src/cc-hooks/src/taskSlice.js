import {createSlice} from '@reduxjs/toolkit';

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task_categories: {},
    tasks: {},
    groupTasks: {},
    taskStocks: {},
  },
  reducers: {
    setTasks: (state, params) => {
      const {data, project_id} = params.payload;
      const x = {};
      data.forEach(item => {
        x[item.task_id] = item;
      });
      state.tasks[project_id] = {
        asArray: data,
        asObject: x,
      };
    },
    setTaskCategories: (state, params) => {
      const {data, project_id} = params.payload;
      const arrData = [];
      Object.values(data).forEach(item => arrData.push(item));
      state.task_categories[project_id] = {
        asArray: arrData,
        asObject: data,
      };
    },
    setGroupTasks: (state, params) => {
      const {data, project_id} = params.payload;
      state.groupTasks[project_id] = {
        asArray: null,
        asObject: data,
      };
    },
    addNewTask: (state, params) => {
      const {data, project_id, parent_id} = params.payload;
      if (state.groupTasks[project_id].asObject[parent_id]) {
        state.groupTasks[project_id].asObject[parent_id].push(data);
      } else {
        state.groupTasks[project_id].asObject[parent_id] = [data];
      }
      state.tasks[project_id].asArray.push(data);
    },
    editTask: (state, params) => {
      const {task, project_id, parent_id} = params.payload;
      const index = state.groupTasks[project_id].asObject[parent_id].findIndex(
        item => item.task_id === task.task_id,
      );
      const tindex = state.tasks[project_id].asArray.findIndex(
        item => item.task_id === task.task_id,
      );
      task.start_date =
        typeof task.start_date === 'object'
          ? task.start_date.toISOString()
          : task.start_date;
      task.end_date =
        typeof task.end_date === 'object'
          ? task.end_date.toISOString()
          : task.end_date;
      if (index !== -1) {
        state.groupTasks[project_id].asObject[parent_id][index] = {
          ...state.groupTasks[project_id].asObject[parent_id][index],
          ...task,
        };
        state.tasks[project_id].asArray[tindex] = task;
      }
    },
    deleteTask: (state, params) => {
      const {task_id, project_id, parent_id} = params.payload;
      const index = state.groupTasks[project_id].asObject[parent_id].findIndex(
        item => item.task_id === task_id,
      );
      const tindex = state.tasks[project_id].asArray.findIndex(
        item => item.task_id === task_id,
      );
      if (index !== -1) {
        state.groupTasks[project_id].asObject[parent_id].splice(index, 1);
        state.tasks[project_id].asArray.splice(tindex, 1);
      }
    },
    updateDoneTask: (state, params) => {
      const {task, amount, project_id} = params.payload;
      const index = state.groupTasks[project_id].asObject[
        task.parent_id
      ].findIndex(item => item.task_id === task.task_id);
      if (
        state.groupTasks[project_id].asObject[task.parent_id][index].completed
      ) {
        state.groupTasks[project_id].asObject[task.parent_id][
          index
        ].completed += parseFloat(amount);
      } else {
        state.groupTasks[project_id].asObject[task.parent_id][index].completed =
          parseFloat(amount);
      }
    },
    setTaskStocks: (state, parmas) => {
      const {project_id, data} = parmas.payload;
      state.taskStocks[project_id] = data;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTasks,
  setTaskCategories,
  setGroupTasks,
  addNewTask,
  editTask,
  deleteTask,
  updateDoneTask,
  setTaskStocks,
  issueStockAtTask,
} = taskSlice.actions;

export default taskSlice.reducer;
