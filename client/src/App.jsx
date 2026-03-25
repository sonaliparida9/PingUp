import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/pages/Login'
import Feed from './components/pages/Feed'
import Messages from './components/pages/Messages'
import ChatBox from './components/pages/ChatBox'
import Discover from './components/pages/Discover'
import Connections from './components/pages/Connections'
import CreatePost from './components/pages/CreatePost'
import Profile from './components/pages/Profile'
import {useUser, useAuth} from '@clerk/clerk-react'
import Layout from './components/pages/Layout'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'



const App = () => {
  const {user} = useUser()
  const {getToken} = useAuth()

  useEffect(()=>{
    if(user){
      getToken().then((token)=>console.log(token))
    }
  },[user])
  return (
    <>
    <Toaster />
    <Routes>
      <Route path='/' element={ !user ? <Login /> : <Layout/>}>
        <Route index element={<Feed/>}/>
        <Route path='messages' element={<Messages/>}/>
        <Route path='messages/:userId' element={<ChatBox/>}/>
        <Route path='connections' element={<Connections/>}/>
        <Route path='discover' element={<Discover/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='profile/:profile' element={<Profile/>}/>
        <Route path='create-post' element={<CreatePost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App