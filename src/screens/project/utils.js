/* eslint-disable react/react-in-jsx-scope */
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

export const projectScreens = [
  {
    id: 1,
    value: 'tasks',
    name: 'Tasks',
    icon: <MaterialIcons name="task-alt" size={17} color="#555" />,
    table_id: 1019,
  },
  {
    id: 2,
    value: 'stocks',
    name: 'Materials',
    icon: <Feather name="activity" size={17} color="#555" />,
    table_id: 1014,
  },
  {
    id: 3,
    value: 'assets',
    name: 'Assets',
    icon: (
      <MaterialCommunityIcons name="chart-box-outline" size={17} color="#555" />
    ),
    table_id: 1001,
  },
  {
    id: 4,
    value: 'issues',
    name: 'Issues',
    icon: (
      <MaterialCommunityIcons
        name="information-outline"
        size={17}
        color="#555"
      />
    ),
    table_id: 1025,
  },
  {
    id: 5,
    value: 'reports',
    name: 'Reports',
    icon: <Entypo name="text-document" size={17} color="#555" />,
    table_id: 1026,
  },
  {
    id: 6,
    value: 'attendance',
    name: 'Attendance',
    icon: (
      <MaterialCommunityIcons
        name="calendar-check-outline"
        size={17}
        color={'#555'}
      />
    ),
    table_id: 1028,
  },
  {
    id: 7,
    value: 'expenses',
    name: 'Expenses',
    icon: <MaterialIcons name="currency-rupee" size={17} color="#555" />,
  },
  {
    id: 8,
    value: 'documents',
    name: 'Documents',
    icon: (
      <MaterialCommunityIcons
        name="file-document-outline"
        size={17}
        color="#555"
      />
    ),
  },
  {
    id: 9,
    value: 'employees',
    name: 'Employees',
    icon: <FontAwesome5 name="user" size={17} color="#555" />,
    table_id: 1013,
  },
];
