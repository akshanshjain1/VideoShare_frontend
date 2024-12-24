import { useState } from "react";
import { useForm } from "react-hook-form";
import Profile from "../ownprofile/profile";
const FormOverlay = ({ action, onClose, onSubmit, issubmit }) => {
    const { register, handleSubmit, reset } = useForm();
    const [user, setUser] = useState(null); // /* Changes Start */ Default user state is null for conditional rendering /* Changes End */
  
    const handleFormSubmit = (data) => {
      onSubmit(action, data);
      reset();
    };
    return (
      <div className="form-overlay">
        <div className="form-content form-container">
          <h3>{action}</h3>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {
              action ==='Profile' && (
                <input 
                  {...register('Username') } 
                  placeholder='Username'
                  type='text'
                  required
                />
              )
            }
            {action === 'Change Password' && (
              <>
                <input {...register('oldPassword')} placeholder="Old Password" type="password" required />
                <input {...register('newPassword')} placeholder="New Password" type="password" required />
              </>
            )}
            {action === 'Change Avatar' && (
              <div className="form-group">
                <label>Avatar</label>
                <input type="file" accept="image/*" {...register('avatar', { required: 'Avatar is required' })} />
              </div>
            )}
            {action === 'Change Cover Image' && (
              <div className="form-group">
                <label>Cover Image</label>
                <input type="file" accept="image/*" {...register('coverimage')} />
              </div>
            )}
            {action === 'Change Name' && (
              <>
                <input {...register('fullname')} placeholder="New Name" type="text" required />
                <input {...register('email')} placeholder="Email" type="email" required />
              </>
            )}
            {action === 'See Profile' && 
              <Profile/>
            }
            {action !== 'See Profile' && (
              <button type="submit">{issubmit ? 'Submitting' : 'Submit'}</button>
            )}
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    );
  }
 export default FormOverlay 