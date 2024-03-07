import React, { useContext, useReducer } from 'react'

export const setters = (state, action) => {
  const { keys, values } = action
  if (keys && values && keys.length === values.length) {
    if (keys.length === values.length) {
      const updateData = {}
      keys.forEach((keyName, keyIndex) => {
        if (Object.prototype.hasOwnProperty.call(state, keyName)) {
          updateData[keyName] = values[keyIndex]
        }
      })
      return {
        ...state,
        ...updateData,
      }
    }
  }
  return state
}

const initContext = {
  alert: {
    alertType: '',
    showAlert: false,
    title: '',
    body: '',
  },
  dispatch: () => {},
  dispatchAlert: () => {},
}

export const AlertProviderContext = React.createContext(initContext)

export const useAlertProviderContext = () => useContext(AlertProviderContext)

export const AlertProvider = (props) => {
  const [state, dispatch] = useReducer(setters, initContext)

  const dispatchAlert = (alertType, title, body) => {
    dispatch({
      keys: ['alert'],
      values: [
        {
          alertType,
          showAlert: true,
          title,
          body,
        },
      ],
    })

    setTimeout(() => {
      dispatch({
        keys: ['alert'],
        values: [
          {
            alertType: '',
            showAlert: false,
            title: '',
            body: '',
          },
        ],
      })
    }, 3000)
  }

  return (
    <AlertProviderContext.Provider
      value={{
        ...state,
        dispatch,
        dispatchAlert,
      }}
    >
      {props.children}
    </AlertProviderContext.Provider>
  )
}
