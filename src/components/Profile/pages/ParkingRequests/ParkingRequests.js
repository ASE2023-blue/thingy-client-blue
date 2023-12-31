import {
  notifyError,
  notifySuccess,
} from '../../../../store/slices/notification';
import { acceptParkingRequest } from '../../../../store/slices/parking';
import {
  addressCellStyles,
  descriptionCellStyles,
  tableContainerStyles,
  textContentCellStyles,
} from './ParkingRequestMUIStyles';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/**
 * ParkingRequests component in the Profile page, containing the requests for a parking (only for admins).
 *
 * @version 1.0.0
 * @author [Gobi Ahonon](https://github.com/ahonongobia)
 * @author [Werner Schmid](https://github.com/werner94fribourg)
 */
const ParkingRequests = () => {
  const { jwt } = useSelector(state => state.auth);
  const { unvalidated } = useSelector(state => state.parking);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const viewParkingHandler = id => {
    navigate(`/parkings/${id}`);
  };

  const validateParkingHandler = async id => {
    const { valid, message } = await acceptParkingRequest(jwt, id, dispatch);

    if (!valid) {
      notifyError(message, dispatch);
      return;
    }

    notifySuccess(message, dispatch);
  };

  const processedParkings = unvalidated
    ? unvalidated?.map(parking => {
        const {
          location: { street, housenumber, postcode, city },
        } = parking;
        const streetNumber = `${street ? street + ' ' : ''}${
          housenumber ? housenumber : ''
        }`;

        const address = `${streetNumber ? streetNumber + ', ' : ''}${
          postcode ? postcode + ' ' : ''
        }${city ? city : ''}`;
        return {
          id: parking._id,
          name: parking.name,
          description: parking.description,
          type: parking.type,
          price: parking.price,
          address,
          validated: parking.isValidated ? 'Yes' : 'No',
        };
      })
    : [];

  return (
    <TableContainer component={Paper} sx={tableContainerStyles}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell sx={descriptionCellStyles}>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>CHF/H</TableCell>
            <TableCell sx={addressCellStyles}>Address</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processedParkings.map(parking => (
            <TableRow key={parking.id}>
              <TableCell>{parking.id}</TableCell>
              <TableCell>{parking.name}</TableCell>
              <TableCell sx={textContentCellStyles}>
                {parking.description}
              </TableCell>
              <TableCell>{parking.type}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {parking.price}
              </TableCell>
              <TableCell sx={textContentCellStyles}>
                {parking.address}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => {
                    viewParkingHandler(parking.id);
                  }}
                >
                  View
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="contained"
                  color="success"
                  onClick={() => {
                    validateParkingHandler(parking.id);
                  }}
                >
                  Validate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ParkingRequests.propTypes = {};
export default ParkingRequests;
