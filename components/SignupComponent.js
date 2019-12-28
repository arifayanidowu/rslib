import {
  Typography,
  Paper,
  Avatar,
  FormControl,
  InputLabel,
  Input,
  Button,
  IconButton,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PersonIcon from "@material-ui/icons/Person";
import React, { useState, useEffect } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Fade from "@material-ui/core/Fade";
import axios from "axios";
import Link from "next/link";
import { handleSignup } from "../utils/auth";
import { departments } from "../utils/departments";
import baseUrl from "../utils/baseUrl";

const INITIAL_STATE = {
  name: "",
  email: "",
  department: "",
  password: "",
  isLoading: false,
  showPassword: false,
  error: "",
  openError: false,
  Transition: Fade
};

export default function Signup() {
  const [state, setState] = useState(INITIAL_STATE);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const user = {
      name: state.name,
      email: state.email,
      password: state.password,
      department: state.department
    };
    let isValid = Object.values(user).every(el => Boolean(el));
    isValid ? setDisabled(false) : setDisabled(true);
  }, [state.name, state.email, state.password, state.department]);

  const handleChange = e => {
    const { target } = e;
    setState(prevState => ({ ...prevState, [target.name]: target.value }));
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };
  const classes = useStyles();

  const showError = err => {
    const error = (err.response && err.response.data) || err.message;
    setState({ error, openError: true, isLoading: false });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setState(prevState => ({ ...prevState, isLoading: true }));
      const payload = {
        name: state.name,
        email: state.email,
        department: state.department,
        password: state.password
      };
      await axios.post(`${baseUrl}/api/signup`, payload);
      handleSignup();
    } catch (err) {
      showError(err);
    }
  };

  const handleClose = () => {
    setState({
      ...state,
      openError: false
    });
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h1">
        SIGN UP
      </Typography>
      <Card className={classes.flex}>
        <CardMedia
          image="/images/library.jpg"
          alt="Tea Cup"
          className={classes.cover}
        />
        <CardContent className={classes.content}>
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit} className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                name="name"
                type="text"
                value={state.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                name="email"
                type="email"
                value={state.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="department">Department</InputLabel>
              <Select
                value={state.department}
                onChange={handleChange}
                inputProps={{
                  name: "department",
                  id: "department"
                }}
              >
                {departments.map((dept, i) => (
                  <MenuItem key={i} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type={state.showPassword ? "text" : "password"}
                value={state.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={state.isLoading || disabled}
            >
              {state.isLoading ? (
                <span className={classes.flexBtn}>
                  Signing up... <CircularProgress size="1rem" />
                </span>
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
            <Link href="/login">
              <a className={classes.loginLink}>
                Already have an account? Try Login in
              </a>
            </Link>
          </form>

          {state.error && (
            <Snackbar
              open={state.openError}
              onClose={handleClose}
              TransitionComponent={state.Transition}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              message={
                <span id="message-id" style={{ color: "red" }}>
                  {state.error}
                </span>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8),
    textAlign: "center",
    backgroundImage:
      "linear-gradient(33deg, transparent 0%, transparent 8%,rgba(9, 9, 9,0.02) 8%, rgba(9, 9, 9,0.02) 59%,transparent 59%, transparent 100%),linear-gradient(234deg, transparent 0%, transparent 32%,rgba(225, 225, 225,0.02) 32%, rgba(225, 225, 225,0.02) 99%,transparent 99%, transparent 100%),linear-gradient(312deg, transparent 0%, transparent 24%,rgba(93, 93, 93,0.02) 24%, rgba(93, 93, 93,0.02) 58%,transparent 58%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2)
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.primary.light
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2)
  },
  submit: {
    marginTop: theme.spacing(2)
  },
  loginLink: {
    marginTop: 10,
    display: "block"
  },
  flex: {
    display: "flex",
    marginTop: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    // height: "100%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column"
    }
  },
  cover: {
    width: "100%",
    objectFit: "contain",
    objectPosition: "center"

    // height: 300
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(6),
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1)
    }
  },
  flexBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));
