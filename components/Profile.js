import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Input,
  InputLabel,
  Avatar,
  TextField,
  Button,
  FormControl,
  Snackbar,
  Dialog,
  Chip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import EditSharp from "@material-ui/icons/EditSharp";
import CloudUpload from "@material-ui/icons/CloudUpload";
import { darken } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";

import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import config from "../utils/config";
import { useRouter } from "next/router";

const INITIAL_STATE = {
  avatar: "",
  name: "",
  about: "",
  email: "",
  openError: false
};

export default function Profile({ _id }) {
  const classes = useStyles();
  const [state, setState] = useState(INITIAL_STATE);
  const [mediaPreview, setMediaPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userUrl = `${baseUrl}/api/user?id=${_id}`;
  const [snack, setSnack] = useState({
    success: false,
    msg: "",
    Transition: Fade
  });
  const router = useRouter();

  useEffect(() => {
    let abort = new AbortController();

    axios
      .get(userUrl)
      .then(res => {
        setState(prevState => ({
          ...prevState,
          name: res.data.name,
          about: res.data.about,
          avatar: res.data.avatar,
          email: res.data.email,
          openError: false
        }));
      })
      .catch(err => {
        setState({ openError: true });
        console.error(err);
      });

    return () => {
      return abort.abort();
    };
  }, [userUrl]);

  const handleClose = () => setState({ openError: false });

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setState(prevState => ({ ...prevState, avatar: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setState(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const showSuccess = msg => {
    setSnack({ success: true, msg });
  };

  const handleCloseSuccess = () => {
    setSnack({ success: false });
    router.reload();
  };

  const handleAvatarUpload = async e => {
    try {
      const userData = new FormData();
      e.preventDefault();
      setLoading(true);
      const url = `${baseUrl}/api/account`;
      const { avatar } = state;
      userData.append("file", avatar);
      userData.append("upload_preset", "rslibrary");
      userData.append("cloud_name", "stizzle");

      const res = await axios.post(config.CLOUDINARY_URL, userData);

      let payload = {};
      payload._id = _id;
      payload.avatar = res.data.secure_url;
      const response = await axios.patch(url, payload);
      setLoading(false);
      showSuccess("Avatar uploaded successfully.");
    } catch (error) {
      setState({ openError: true });
      catchErrors(error, setError);
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setLoading(true);
      const url = `${baseUrl}/api/user`;

      const { name, about, email } = state;
      const payload = { name, about, _id, email };
      const response = await axios.patch(url, payload);

      setLoading(false);
    } catch (error) {
      setState({ openError: true });
      catchErrors(error, setError);
      setLoading(false);
    }
  };

  return (
    <div className={classes.base}>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant="h5" component="h1">
            Edit Profile
          </Typography>

          <form onSubmit={handleSubmit} className={classes.form}>
            <div>
              <label htmlFor="avatar" className={classes.uploadButton}>
                <Tooltip title="Click to Upload Avatar" placement="right">
                  <Avatar
                    src={mediaPreview || state.avatar}
                    className={classes.bigAvatar}
                  />
                </Tooltip>
              </label>
              <>
                <IconButton
                  onClick={handleAvatarUpload}
                  disabled={!state.avatar || !mediaPreview}
                >
                  <Tooltip title="Click to upload" placement="right">
                    <AddAPhotoIcon color="secondary" fontSize="large" />
                  </Tooltip>
                </IconButton>
                <Chip
                  icon={<ArrowBackIcon />}
                  color="secondary"
                  label="click Icon to upload"
                  size="small"
                  disabled={!state.avatar || !mediaPreview}
                  className={classes.chip}
                />
              </>
            </div>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              className={classes.input}
              onChange={handleChange}
            />

            <span className={classes.filename}>
              {state.avatar && state.avatar.name}
            </span>
            <FormControl margin="normal" fullWidth required>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                type="text"
                name="name"
                value={state.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth required>
              <InputLabel htmlFor="name">Email</InputLabel>
              <Input
                type="text"
                name="email"
                value={state.email}
                onChange={handleChange}
              />
            </FormControl>
            <TextField
              id="outlined-textarea"
              label={`Write something about yourself, ${state.name}`}
              placeholder={`Write something about yourself, ${state.name}`}
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              name="about"
              value={state.about}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              disabled={!(state.name && state.email) || loading}
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? (
                <span>
                  Saving...
                  <CircularProgress size="1rem" color="secondary" />
                </span>
              ) : (
                <span>Save</span>
              )}
            </Button>
          </form>

          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={state.openError}
              onClose={handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}

          {snack.success && (
            <Snackbar
              open={snack.success}
              onClose={handleCloseSuccess}
              TransitionComponent={snack.Transition}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              ContentProps={{
                "aria-describedby": "message-id"
              }}
              // autoHideDuration={6000}
              action={
                <IconButton color="secondary" onClick={handleCloseSuccess}>
                  <CloseIcon color="secondary" />
                </IconButton>
              }
              message={<span id="message-id-3">{snack.msg}</span>}
            />
          )}
        </Paper>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  base: {
    width: "100%",
    height: "100%",
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(135deg, transparent 0%, transparent 6%,rgba(71, 71, 71,0.04) 6%, rgba(71, 71, 71,0.04) 22%,transparent 22%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 20%,rgba(71, 71, 71,0.04) 20%, rgba(71, 71, 71,0.04) 47%,transparent 47%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(71, 71, 71,0.04) 24%, rgba(71, 71, 71,0.04) 62%,transparent 62%, transparent 100%),linear-gradient(45deg, transparent 0%, transparent 73%,rgba(71, 71, 71,0.04) 73%, rgba(71, 71, 71,0.04) 75%,transparent 75%, transparent 100%),linear-gradient(90deg, rgb(255,255,255),rgb(255,255,255))",
    padding: theme.spacing(8),
    backgroundAttachment: "fixed",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1)
    }
  },
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1)
    }
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.light
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
    "&:hover": {
      cursor: "pointer"
    }
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2)
  },
  submit: {
    marginTop: theme.spacing(2)
  },
  flex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  forgotPass: {
    float: "right",
    display: "inline-block",
    marginTop: "7px"
  },
  gridIt: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20
  },
  input: {
    display: "none"
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.25em"
  },
  textField: {
    width: "100%"
  },
  submit: {
    backgroundColor: theme.palette.secondary.light,
    "&:hover": {
      backgroundColor: darken(theme.palette.secondary.light, 0.1)
    }
  },
  chip: {
    position: "relative"
    // width: "100%"
  }
}));
