import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import axios from 'axios';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function EmailVerify() {

  
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)
  const navigate = useNavigate()
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true
      const otpArray = inputRefs.current.map((e) => e.value)
      const otp = otpArray.join('')

      const response = await axios.post(`${backendUrl}/api/auth/verify-account`, {otp})
      if(response.data.success){
        toast.success(response.data.message)
        getUserData()
        navigate('/')
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')}
        src={assets.logo} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-5 md:left-20 left-5' />

        <form onSubmit={onSubmitHandler}
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-white text-2xl text-center font-semibold mb-4'>Email Verify OTP</h1>
            <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

            <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input className='bg-[#333A5C] w-12 h-12 text-white text-center text-xl rounded-md'
                type="text" maxLength={1} key={index} required
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button className='w-full text-white py-3 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-full'>Verify email</button>
        </form>
    </div>
  )
}

export default EmailVerify
