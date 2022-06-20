import React, { useRef, useState } from 'react'
import './auth.css'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../Auth/authContext';
import { useHomeController } from '../HomeContext';
import { Button } from '../CommonComponents/Button/Button';

export default function Login() {
  const emailRef = useRef();
  const passRef = useRef();
  const {login} = useAuth();
  const [errors, setErrors] = useState();
  const {loading, setLoading} = useHomeController();
  const history = useHistory();

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login(emailRef.current.value, passRef.current.value);
      setLoading(false);
      history.push('/');
    } catch (error) {
      setErrors([error.message]);
      setLoading(false);
    }
  } 

  return (
    <>
    <div className='auth__background'>
      <div className='container auth__container'>
        <div className='card auth__card'>
            <div className='card-body auth__card-body'>
                <h2 className='text-center auth__title'>Login</h2>
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
                    <Button customClass={"auth__submit"} disabled={loading}>Login</Button>
                </form>
                <p className='text-center'>Don't have an account ? <Link to={'/signup'}><strong>Sign up here</strong></Link></p>
            </div>
        </div>
      </div>
    </div>
    </>
  )
}
