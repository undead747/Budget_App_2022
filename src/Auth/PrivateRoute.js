import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from './authContext'

export default function PrivateRoute({component: Component, ...rest}) {
  const {currentUser} = useAuth()

  return (
    <Route {...rest} render={routes => currentUser ? <Component {...routes} /> : <Redirect to={'/login'} /> } />
)
}
