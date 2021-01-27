import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withFormik } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {
  Grid,
  Box,
  Divider,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Tooltip,
  ClickAwayListener,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';

import CustomButton from '../../components/button/Button';
import * as AuthActions from '../../store/actions/authActions';
import styles from '../../assets/js/styles/views/signup/signupStyles';

const useStyles = makeStyles(styles);

const handleMouseDownPassword = e => {
  e.preventDefault();
};

const get_locations = props => {
  return props.get_locations(props);
};

const signup = (e, props) => {
  e.preventDefault();
  if (props.values.location.length < 1) {
    props.validateField('location');
  } else {
    return props.signup(props).catch(error => {
      const messages = JSON.parse(error.message);
      if (typeof messages === 'object') {
        let non_field_errors;
        Object.keys(messages).forEach(key => {
          if (key === 'non_field_errors') {
            non_field_errors = { error: messages[key][0] };
          } else if (key === 'location') {
            props.setFieldTouched('user_location', true, false);
            props.setFieldError('user_location', messages[key][0]);
          } else {
            props.setFieldTouched(key, true, false);
            props.setFieldError(key, messages[key][0]);
          }
        });
        return non_field_errors;
      } else {
        return {
          error: props.t('signup.others.errors.unexpected'),
        };
      }
    });
  }
};

const handleTooltipToggle = ({ toolTipOpen }) => {
  return { toolTipOpen: !toolTipOpen };
};

function Signup(props) {
  const [state, setState] = React.useState({
    error: null,
    locations: [],
    showPassword1: false,
    showPassword2: false,
    toolTipOpen: false,
  });

  React.useEffect(() => {
    handleSetState(get_locations(props));
  }, []);

  const classes = useStyles();

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  const { error, locations, toolTipOpen, showPassword1, showPassword2 } = state;
  const { t } = props;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="signup"
                noValidate="noValidate"
                onSubmit={e => handleSetState(signup(e, props))}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  {t('signup.welcome.primary')}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {t('signup.welcome.secondary')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box component="p" className={error && classes.errorBox}>
                      {error && (
                        <Box component="span" className={classes.error}>
                          {error}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['username'] && props.errors['username']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                      >
                        Username
                      </InputLabel>
                      <ClickAwayListener
                        onClickAway={() =>
                          handleSetState(handleTooltipToggle(state))
                        }
                      >
                        <Tooltip
                          title="Do not use your real name here!"
                          placement="top-start"
                          arrow
                          onClose={() =>
                            handleSetState(handleTooltipToggle(state))
                          }
                          PopperProps={{
                            disablePortal: true,
                          }}
                          open={toolTipOpen}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                        >
                          <OutlinedInput
                            className={classes.customInputStyle}
                            id="username"
                            name="username"
                            type="text"
                            onClick={() =>
                              handleSetState(handleTooltipToggle(state))
                            }
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            labelWidth={90}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                      <FormHelperText error>
                        {props.touched['username'] &&
                          props.errors['username'] &&
                          t(
                            `signup.inputs.username.errors.${this.props.errors['username']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                      error={props.touched['email'] && props.errors['email']}
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="email"
                      >
                        {t('signup.inputs.email.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="email"
                        name="email"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {props.touched['email'] &&
                          props.errors['email'] &&
                          t(
                            `signup.inputs.email.errors.${props.errors['email']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['dateOfBirth'] &&
                        props.errors['dateOfBirth']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="dateOfBirth"
                        shrink
                      >
                        {t('signup.inputs.dateOfBirth.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={clsx(
                          classes.customInputStyle,
                          classes.DOBInputStyle,
                        )}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue=""
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={90}
                      />
                      <FormHelperText error>
                        {props.touched['dateOfBirth'] &&
                          props.errors['dateOfBirth'] &&
                          t(
                            `signup.inputs.dateOfBirth.errors.${props.errors['dateOfBirth']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['user_location'] &&
                        props.errors['user_location']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        id="user_location"
                      >
                        {t('signup.inputs.location.label')}
                      </InputLabel>
                      <Select
                        labelId="user_location"
                        id="user_location"
                        name="user_location"
                        className={classes.customInputStyle}
                        defaultValue=""
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        label="Location"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {Array.isArray(locations) &&
                          locations.map(location => (
                            <MenuItem key={location.name} value={location.name}>
                              {location.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText error>
                        {props.touched['user_location'] &&
                          props.errors['user_location'] &&
                          t(
                            `signup.inputs.location.errors.${props.errors['user_location']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['password1'] && props.errors['password1']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password1"
                      >
                        {t('signup.inputs.password1.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password1"
                        name="password1"
                        type={showPassword1 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setState({
                                  ...state,
                                  showPassword1: !showPassword1,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword1 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {props.touched['password1'] &&
                          props.errors['password1'] &&
                          t(
                            `signup.inputs.password1.errors.${props.errors['password1']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={
                        props.touched['password2'] && props.errors['password2']
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password2"
                      >
                        {t('signup.inputs.password2.label')}
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password2"
                        name="password2"
                        type={showPassword2 ? 'text' : 'password'}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setState({
                                  ...state,
                                  showPassword2: !showPassword2,
                                })
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword2 ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText error>
                        {props.touched['password2'] &&
                          props.errors['password2'] &&
                          t(
                            `signup.inputs.password2.errors.${props.errors['password2']}`,
                          )}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      primaryButtonStyle
                      type="submit"
                      fullWidth
                    >
                      {t('signup.submit')}
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box className={classes.center}>
                    <Divider className={classes.divider} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {t('signup.others.alreadyAMember')}
                    </Typography>
                    <Divider className={classes.divider} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Link to="/login" className={classes.textDecorationNone}>
                    <CustomButton
                      variant="outlined"
                      size="large"
                      secondaryButtonStyle
                      fullWidth
                    >
                      {t('signup.others.login')}
                    </CustomButton>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

Signup.propTypes = {
  auth: PropTypes.object.isRequired,
  set_auth_user: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  get_locations: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    set_auth_user: auth_user => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
    signup: props => {
      return dispatch(AuthActions.signup(props));
    },
    get_locations: props => {
      return dispatch(AuthActions.get_locations(props));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withFormik({
    mapPropsToValue: () => ({
      username: '',
      email: '',
      user_location: '',
      password1: '',
      password2: '',
    }),
    validationSchema: Yup.object().shape({
      username: Yup.string().required('required'),
      email: Yup.string().email('invalidEmail').required('required'),
      dateOfBirth: Yup.date().max(new Date(), 'max').required('required'),
      user_location: Yup.string().min(1, 'min').required('required'),
      password1: Yup.string().min(8, 'min').required('required'),
      password2: Yup.string()
        .oneOf([Yup.ref('password1'), null], 'noMatch')
        .required('required'),
    }),
  })(Signup),
);
