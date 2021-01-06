import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { withFormik } from "formik";
import * as Yup from "yup";

import { makeStyles } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
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
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import * as AuthActions from "../../store/actions/authActions";
import styles from "../../assets/js/styles/views/signup/signupStyles";

function Signup(props) {
  const [state, setState] = React.useState({
    error: null,
  });

  const [locations, setLocations] = React.useState([]);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [toolTipOpen, setToolTipOpen] = React.useState(false);

  React.useEffect(() => {
    props.api
      .get_locations()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0 && res[0].name) {
          setLocations(res);
        } else {
          res = Object.keys(res)
            .map((key) => res[key])
            .join("\n");
          throw new Error(res);
        }
      })
      .catch((error) => {
        if (error.message.startsWith("Unexpected")) {
          setState({
            error:
              "An error occured while performing this action. Please try again later",
          });
        } else {
          setState({ ...state, error: error.message });
        }
      });
  }, []);

  const classes = makeStyles(styles)();

  const signup = (e) => {
    e.preventDefault();
    if (props.values.location.length < 1) {
      props.validateField("location");
    } else {
      props.api
        .signup(props.values)
        .then((res) => {
          if (!res.key) {
            res = Object.keys(res)
              .map((key) => res[key])
              .join("\n");
            throw new Error(res);
          }
          return props.set_auth_user({ token: res.key });
        })
        .then((val) => props.history.push("/profile"))
        .catch((error) => {
          if (error.message.startsWith("Unexpected")) {
            setState({
              error:
                "An error occured while performing this action. Please try again later",
            });
          } else {
            setState({ ...state, error: error.message });
          }
        });
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleTooltipClose = () => {
    setToolTipOpen(false);
  };

  const handleTooltipOpen = () => {
    setToolTipOpen(true);
  };

  let { error } = state;

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
                onSubmit={signup}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  Welcome to Zubhub
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Create an account to submit a project
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
                        props.touched["username"] && props.errors["username"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="username"
                      >
                        Username
                      </InputLabel>
                      <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Tooltip
                          title="Do not use your real name here!"
                          placement="top-start"
                          arrow
                          onClose={handleTooltipClose}
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
                            onClick={handleTooltipOpen}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            labelWidth={90}
                          />
                        </Tooltip>
                      </ClickAwayListener>
                      <FormHelperText error>
                        {props.touched["username"] && props.errors["username"]}
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
                      error={props.touched["email"] && props.errors["email"]}
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="email"
                      >
                        Email
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
                        {props.touched["email"] && props.errors["email"]}
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
                        props.touched["dateOfBirth"] &&
                        props.errors["dateOfBirth"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="dateOfBirth"
                        shrink
                      >
                        Date Of Birth
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue=""
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        labelWidth={90}
                      />
                      <FormHelperText error>
                        {props.touched["dateOfBirth"] &&
                          props.errors["dateOfBirth"]}
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
                        props.touched["user_location"] &&
                        props.errors["user_location"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        id="user_location"
                      >
                        Location
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
                          locations.map((location) => (
                            <MenuItem key={location.name} value={location.name}>
                              {location.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText error>
                        {props.touched["user_location"] &&
                          props.errors["user_location"]}
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
                        props.touched["password1"] && props.errors["password1"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password1"
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password1"
                        name="password1"
                        type={showPassword1 ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword1(!showPassword1)}
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
                        {props.touched["password1"] &&
                          props.errors["password1"]}
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
                        props.touched["password2"] && props.errors["password2"]
                      }
                    >
                      <InputLabel
                        className={classes.customLabelStyle}
                        htmlFor="password2"
                      >
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        className={classes.customInputStyle}
                        id="password2"
                        name="password2"
                        type={showPassword2 ? "text" : "password"}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword2(!showPassword2)}
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
                        {props.touched["password2"] &&
                          props.errors["password2"]}
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
                      Signup
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
                      Already a Member ?
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
                      Login
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
  api: PropTypes.object.isRequired,
  set_auth_user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    set_auth_user: (auth_user) => {
      dispatch(AuthActions.setAuthUser(auth_user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValue: () => ({
      email: "",
      user_location: "",
      password1: "",
      password2: "",
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string().email("invalid email").required("invalid email"),
      dateOfBirth: Yup.date()
        .max(new Date(), "your date of birth can't be greater than today")
        .required("please input your date of birth"),
      user_location: Yup.string()
        .min(1, "your location is too short")
        .required("please input your location"),
      password1: Yup.string()
        .min(8, "your password is too short")
        .required("input your password"),
      password2: Yup.string()
        .oneOf([Yup.ref("password1"), null], "Passwords must match")
        .required("input a confirmation password"),
    }),
  })(Signup)
);