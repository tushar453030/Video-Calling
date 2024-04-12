import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'
import '../screens/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const LobbyScreen = () => {
  const [email, setEmail] = useState('')
  const [room, setRoom] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [subject, setSubject] = useState('')

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
              className='lobbyForm'
              placeholder='Email'
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='room'>
            <input
              className='lobbyForm'
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
      <div class='connect'>
        {/* <form className='adminConnect'>
          <h2>If you are facing issue. Let's Connect on Mail :)</h2>
          <div class='text'>Contact us Form</div>
          <div className='clientEmail'>
            <input
              type='email'
              id='email'
              value={email}
              placeholder='Enter Your Email'
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <div className='subject'>
            <input
              type='text'
              id='subject'
              value={subject}
              placeholder='Enter your Enquiry'
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <button className='Send'>
            <span className='spanSend'>Send Mail</span>
          </button>
        </form> */}

        <div class='text'>Connect With Us :)</div>

        <form className='adminConnect'>
          <div class='mb-5 row'>
            <div class='col'>
              <input
                type='text'
                required
                maxlength='50'
                class='form-control'
                id='first_name'
                name='first_name'
                placeholder='First Name'
              />
            </div>
            <div class='col'>
              <input
                type='text'
                required
                maxlength='50'
                class='form-control'
                id='last_name'
                name='last_name'
                placeholder='Last Name'
              />
            </div>
          </div>
          <div class='mb-5 row'>
            <div class='col'>
              <input
                type='email'
                required
                maxlength='50'
                class='form-control'
                id='email_addr'
                name='email'
                placeholder='name@example.com'
              />
            </div>
            <div class='col'>
              <input
                type='tel'
                required
                maxlength='50'
                class='form-control'
                id='phone_input'
                name='Phone'
                placeholder='Phone'
              />
            </div>
          </div>
          <div class='mb-5'>
            <textarea
              class='form-control'
              id='message'
              name='message'
              rows='5'
              placeholder='Type in your message here....'
            ></textarea>
          </div>
          <button type='submit' class='btn btn-primary px-4 btn-lg'>
            Post
          </button>
        </form>
      </div>
    </div>
  )
}

export default LobbyScreen
