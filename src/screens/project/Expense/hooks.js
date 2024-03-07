import {useState, useEffect} from 'react';
import {axiosInstance} from '../../../apiHooks/axiosInstance';
import {getGroupTasks} from '../Tasks/utils';
import {groupTaskCategoriesForApp} from '../../../cc-utils/src/tasks';

export const useBillHooks = ({project_id, activeContractor, token}) => {
  const [state, setState] = useState({
    groupTasks: [],
    taskCategoriesAsGroup: null,
    taskCategoriesAsObject: null,
  });
  console.log('activeContractor', activeContractor);
  useEffect(() => {
    if (activeContractor && activeContractor.contractor_id) {
      axiosInstance(token)
        .get(`/${project_id}/getTaskCategories`)
        .then(({data}) => {
          const {task_categories, tasks} = data.data;
          console.log('response data', project_id, task_categories);
          const groupTasks = getGroupTasks(tasks);
          const {taskCategoriesAsGroup, taskCategoriesAsObject} =
            groupTaskCategoriesForApp(task_categories);

          setState({
            ...state,
            groupTasks,
            taskCategoriesAsGroup,
            taskCategoriesAsObject,
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [activeContractor]);
  return [state, setState];
};
