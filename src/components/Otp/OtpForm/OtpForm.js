import { sendPin } from '../../../store/slices/auth';
import { notifySuccess } from '../../../store/slices/notification';
import { submitStyles } from './OtpFormMUIStyles';
import { Box, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * OtpForm component in the Otp page, containing the form for confirming the pin code.
 *
 * @version 1.0.0
 * @author [Gobi Ahonon](https://github.com/ahonongobia)
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const OtpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();

    const [{ value: pin }] = Array.from(event.target.elements).filter(
      element => element.name === 'pin',
    );

    const data = await sendPin(
      Number.parseInt(pin),
      localStorage.getItem('email'),
      dispatch,
    );

    if (data.valid) {
      navigate('/profile');
      notifySuccess(data.message, dispatch);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        id="pin"
        name="pin"
        label="Pin code"
        type="password"
        autoFocus
        required
        fullWidth
      />
      <Button type="submit" fullWidth variant="contained" sx={submitStyles}>
        Submit Otp
      </Button>
    </Box>
  );
};

OtpForm.propTypes = {};
export default OtpForm;
