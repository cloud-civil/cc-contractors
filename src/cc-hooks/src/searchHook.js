import React, {useContext, useReducer} from 'react';

export const setters = (state, action) => {
  const {keys, values} = action;
  if (keys && values && keys.length === values.length) {
    if (keys.length === values.length) {
      const updateData = {};
      keys.forEach((keyName, keyIndex) => {
        if (Object.prototype.hasOwnProperty.call(state, keyName)) {
          updateData[keyName] = values[keyIndex];
        }
      });
      return {
        ...state,
        ...updateData,
      };
    }
  }
  return state;
};

const initContext = {
  search: null,
  dispatch: () => {},
};

export const ServiceProviderContext = React.createContext(initContext);

export const useServiceProviderContext = () =>
  useContext(ServiceProviderContext);

export const ServiceProvider = props => {
  const [state, dispatch] = useReducer(setters, initContext);

  return (
    <ServiceProviderContext.Provider
      value={{
        ...state,
        dispatch,
      }}>
      {props.children}
    </ServiceProviderContext.Provider>
  );
};
