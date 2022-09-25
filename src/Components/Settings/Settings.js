import React from 'react'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/authContext';
import { CustomButton } from '../CommonComponents/Button/Button'
import { useHomeController } from '../HomeContext';
import './settings.css'

export default function Settings() {
    // Get loading animantion, alert message, current location information from home-Controller.
    const {
      handleErrorShow,
      handleErrorClose,
      setErrorModalContent,
      setLoading,
    } = useHomeController();

    const {logout} = useAuth();
    const history = useHistory();

  const handleLogout = async () => {
      try {
          setLoading(true);
          await logout();
          setLoading(false);

          history.push("/login");
      } catch (error) {
        setErrorModalContent(error.message);
        handleErrorShow();
      }
  }

  return (
    <div className='settings'>
      <table className="table settings__table">
        <tbody>
          <tr className="settings__table-row">
            <td className='settings__table-column settings__table-icon'>
              <box-icon name='lock-alt'></box-icon>
            </td>
            <td className='settings__table-column'>
              <span>Password</span>
            </td>
          </tr>
          <tr className="settings__table-row">
            <td className='settings__table-column settings__table-icon'>
              <box-icon name='money'></box-icon>
            </td>
            <td className='settings__table-column'>
              <div className='settings__table-title'>
                <span>currency</span>
                <span className="fw-light title-memo">Japanese (￥)</span>
              </div>
            </td>
          </tr>
          <tr className="settings__table-row">
            <td className='settings__table-column settings__table-icon'>
              <i className="fas fa-language"></i>
            </td>
            <td className='settings__table-column'>
              <div className='settings__table-title'>
                <span>Language</span>
                <span className="fw-light title-memo">English</span>
              </div>
            </td>
          </tr>
          <tr className="settings__table-row">
            <td className='settings__table-column settings__table-icon'>
              <box-icon type='solid' name='palette'></box-icon>
            </td>
            <td className='settings__table-column'>
              <div className='settings__table-title'>
                <span>Theme</span>
                <span className="title-memo">Light theme</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <CustomButton customClass="settings__logout-btn" callback={handleLogout}>Logout</CustomButton>
    </div>
  )
}
