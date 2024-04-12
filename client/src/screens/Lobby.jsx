import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'
import '../screens/style.css'

const LobbyScreen = () => {
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')

  const socket = useSocket()
  const navigate = useNavigate()

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault()
      socket.emit('room:join', { email, room })
    },
    [email, room, socket]
  )

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data
      navigate(`/room/${room}`)
    },
    [navigate]
  )

  useEffect(() => {
    socket.on('room:join', handleJoinRoom)
    return () => {
      socket.off('room:join', handleJoinRoom)
    }
  }, [socket, handleJoinRoom])

  return (
    <div className='lobby-container'>
      <div className='container'>
        <nav className='navbar'>
          <div id='trapezoid'>
            <a
              href='https://www.linkedin.com/in/tushar-sharma-a4a032195/'
              className='expandHome'
            >
              LinkedIN
            </a>

            <a href='https://codepen.io/pec-man' className='expandHome'>
              Contact
            </a>

            <a href='https://codepen.io/pec-man' className='expandHome'>
              Connect
            </a>

            <a href='https://codepen.io/pec-man' className='expandHome'>
              Email
            </a>
          </div>
        </nav>
        <h1 className='title'>Lobby</h1>
        <form className='form' onSubmit={handleSubmitForm}>
          <div className='email'>
            <input
              placeholder='Email'
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='room'>
            <input
              type='text'
              id='room'
              value={room}
              placeholder='Room Number'
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button className='Join'>
            <span className='spanJoin'>Join</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default LobbyScreen
