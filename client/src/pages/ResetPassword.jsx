import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

function ResetPassword() {

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [isEmailSent, setIsEmailSent] = useState("")
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {email})
      if(response.data.success){
        toast.success(response.data.message)
        setIsEmailSent(true)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map((e) => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmited(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitNewPassword = async (e) => {
     e.preventDefault()
     try {
       const response = await axios.post(`${backendUrl}/api/auth/reset-password`, {email, otp, newPassword})
       if(response.data.success){
        toast.success(response.data.message)
        navigate("/login")
      }else{
        toast.error(response.data.message)
      }
     } catch (error) {
        toast.error(error.message)
     }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')}
        src={assets.logo} alt="" className='w-28 sm:w-32 cursor-pointer absolute top-5 md:left-20 left-5' />

      {/* enter email id */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl text-center font-semibold mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" required className='outline-none text-white bg-transparent'
              placeholder='Email id' onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <button className='w-full text-white py-3 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-full'>Submit</button>
        </form>
      }

      {/* enter otp  */}
      {!isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitOtp}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl text-center font-semibold mb-4'>Reset password OTP</h1>
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

          <button className='w-full text-white py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-full'>Submit</button>
        </form>
      }

      {/* enter new password  */}
      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl text-center font-semibold mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" required className='outline-none text-white bg-transparent'
              placeholder='Password' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
          </div>
          <button className='w-full text-white py-3 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-full'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword