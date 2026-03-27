import React, { useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage } from './features/messages/messagesSlice'
import toast from 'react-hot-toast'
import Notification from './components/Notification'


const App = () => {
  const {user} = useUser()
  const {getToken} = useAuth()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async () => {
      if(user){
      const token = await getToken()
      dispatch(fetchUser(token))
      dispatch(fetchConnections(token))
    }
    }
    fetchData()
    
  },[user, getToken, dispatch])


  useEffect(()=>{
    pathnameRef.current = pathname
  },[pathname])

  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user?.id);
     eventSource.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data)

    // Ignore non-message events
    if (!message.from_user_id) return

    if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
      dispatch(addMessage(message))
    } else {
      toast.custom((t) => (
        <Notification t={t} message={message} />
      ), { position: "bottom-right" })
    }

  } catch (error) {
    // This will catch "Connected to SSE stream"
    console.log("Ignored SSE message:", event.data)
  }
}
      return()=>{
        eventSource.close()
      }
    }
  },[user, dispatch])
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
        <Route path='profile/:profileId' element={<Profile/>}/>
        <Route path='create-post' element={<CreatePost/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App