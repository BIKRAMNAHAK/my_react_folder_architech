import React from 'react'
import store from './Services/store'
import { Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import Home from './Pages/Home'

const  App =()=> {
  return (
    <>
        <Provider store={store}>
          <Routes>
              <Route path='/' element={<Home/>}/>
          </Routes>
        </Provider>
    </>
  )
}


export default App