import React from "react";
import PropTypes from "prop-types";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";

import CustomButton from "../../components/button/Button";
import styles from "../../assets/js/styles/views/email_confirm/emailConfirmStyles";

function EmailConfirm(props) {
  const classes = makeStyles(styles)();

  const [state, setState] = React.useState({
    error: null,
    username: null,
    key: null,
  });

  React.useEffect(() => {
    let { username, key } = getUsernameAndKey(props.location.search);
    setState({ ...state, username, key });
  }, []);

  const getUsernameAndKey = (queryString) => {
    let username = queryString.split("&&");
    let key = username[1].split("=")[1];
    username = username[0].split("=")[1];
    return { username, key };
  };

  const confirmEmail = (e) => {
    e.preventDefault();
    props.api
      .send_email_confirmation(state.key)
      .then((res) => {
        toast.success("Congratulations!, your email has been confirmed!");
        setTimeout(() => {
          props.history.push("/");
        }, 4000);
      })
      .catch((error) => {
        if (error.message.startsWith("Unexpected")) {
          setState({
            ...state,
            error:
              "An error occured while performing this action. Please try again later",
          });
        } else {
          setState({ ...state, error: error.message });
        }
      });
  };

  let { error, username } = state;

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Card className={classes.cardStyle}>
          <CardActionArea>
            <CardContent>
              <form
                className="auth-form"
                name="email_confirm"
                noValidate="noValidate"
                onSubmit={confirmEmail}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.titleStyle}
                >
                  Email Confirmation
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Please Confirm that you are {username} and that the email
                  belongs to you:
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box
                      component="p"
                      className={error !== null && classes.errorBox}
                    >
                      {error !== null && (
                        <Box component="span" className={classes.error}>
                          {error}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomButton
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                      primaryButtonStyle
                    >
                      Confirm
                    </CustomButton>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </CardActionArea>
        </Card>
      </Container>
    </Box>
  );
}

EmailConfirm.propTypes = {
  api: PropTypes.object.isRequired,
};

export default EmailConfirm;