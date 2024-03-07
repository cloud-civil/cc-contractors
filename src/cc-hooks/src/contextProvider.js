/* eslint-disable react/prop-types */
import { useState } from 'react'
import { AuthorizationContext } from './context'

const ContextProvider = ({ children }) => {
  const [authContext] = useState('')
  return (
    <AuthorizationContext.Provider value={{ authContext }}>
      {children}
    </AuthorizationContext.Provider>
  )
}

export default ContextProvider
