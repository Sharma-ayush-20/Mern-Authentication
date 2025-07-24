import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [state, setState] = useState('Sign up')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')}
      src={assets.logo} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-5 md:left-20 left-5' />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center mb-4'>{state === 'Sign up' ? 'Create your account' : 'Login to your account'}</p>

        <form>

          {state === 'Sign up' && (<div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" />
            <input onChange={(e) => setName(e.target.value)} value={name}
            className='bg-transparent outline-none text-white'
              type="text" placeholder='Full Name' required />
          </div>)}

          <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setEmail(e.target.value)} value={email}
            className='bg-transparent outline-none text-white'
              type="email" placeholder='Email id' required />
          </div>

          <div className='mb-4 flex gap-3 items-center w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setPassword(e.target.value)} value={password}
            className='bg-transparent outline-none text-white'
              type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')}
          className='text-left pl-2 text-indigo-500 cursor-pointer mb-4'>Forget password?</p>

          <button className='bg-gradient-to-r from-indigo-500 to-indigo-900 w-full py-2.5 rounded-xl cursor-pointer font-medium text-white'>{state}</button>

        </form>

        {state === 'Sign up' ? (
          <p className='text-center text-gray-400 text-xs mt-4'>Already have an account?{' '}
            <span onClick={() => setState('Login')}
             className='text-blue-400 cursor-pointer underline'>Login here</span>
          </p>
        ) : (
          <p className='text-center text-gray-400 text-xs mt-4'>Don't have an account?{' '}
            <span onClick={() => setState('Sign up')}
            className='text-blue-400 cursor-pointer underline'>Signup</span>
          </p>
        )}

      </div>

    </div>
  )
}

export default Login