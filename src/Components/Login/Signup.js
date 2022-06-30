import React, { useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {useAuth} from '../../Auth/authContext'
import { CustomButton } from '../CommonComponents/Button/Button';
import { useHomeController } from '../HomeContext';

export default function Signup() {
  const emailRef = useRef();
  const passRef = useRef();
  const passConfirmRef = useRef();

  const [errors, setErrors] = useState();

  const {signup} = useAuth();
  const {loading, setLoading} = useHomeController();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if(passRef.current.value !== passConfirmRef.current.value) return setErrors(["Passwords not match"]);
    
    try {
      setErrors([]);
      setLoading(true);
      await signup(emailRef.current.value, passRef.current.value);
      setLoading(false);
      history.push('/');     
    } catch (error) {
      setErrors([error.message]);
      setLoading(false);
    }
  }

  return (
    <div className='auth__background'>
    <div className='container auth__container'>
      <div className='card auth__card'>
          <div className='card-body auth__card-body'>
              <h2 className='text-center auth__title'>Sign up</h2>
              <div className='mb-2 mt-2'>
                {errors && errors.map(err => <div className='alert-danger p-1'>{err}</div>)}
              </div>
              <form onSubmit={handleSubmit}>
                  <div className='mb-3'>
                      <label htmlFor="email-label" className='form-label'>Email</label>
                      <input autoComplete='username' type={'email'} className='form-control' ref={emailRef} required />
                  </div>
                  <div className='mb-3'>
                      <label htmlFor="password-label" className='form-label'>Password</label>
                      <input autoComplete='new-password' type={'password'} className='form-control' ref={passRef} required />
                  </div>
                  <div className='mb-3'>
                      <label htmlFor="password-confim-label" className='form-label'>Password Confirmation</label>
                      <input autoComplete='new-password' type={'password'} className='form-control' ref={passConfirmRef} required />
                  </div>
                  <CustomButton type={"submit"} customClass={"auth__submit"} disabled={loading}>Sign up</CustomButton>
              </form>
              <p className='text-center'>Already have an account ? <Link to={'/login'}><strong>Login here</strong></Link></p>
          </div>
      </div>
    </div>
  </div>
  )
}
