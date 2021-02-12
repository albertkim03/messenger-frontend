import React from 'react';
import axios from 'axios';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  DialogContentText,
  Button,
  IconButton,
  TextField,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import AuthContext from '../../AuthContext';
import { useStep } from '../../utils/update';

function MessageShareDialog({ og_message_id, ...props }) {
  const [open, setOpen] = React.useState(false);
  const [selectedChannel, setSelectedChannel] = React.useState('');
  const [channels, setChannels] = React.useState([]);
  const [message, setMessage] = React.useState('');

  const token = React.useContext(AuthContext);

  const step = useStep();


  function fetchChannelData() {
    axios
      .get('channels/list', {
        params: {
          token,
        },
      })
      .then(({ data }) => {
        setChannels(data['channels']);
      })
      .catch((err) => { });
  }

  React.useEffect(() => {
    fetchChannelData();
  }, []);

  const handleChannelSelect = event => {
    const newChannelId = parseInt(event.target.value, 10);
    setSelectedChannel(newChannelId);
  };

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const channel_id = selectedChannel;

    if (channel_id == null) return;

    axios.post(`/message/share`, {
      token,
      og_message_id: Number.parseInt(og_message_id),
      message,
      channel_id: Number.parseInt(channel_id),
    })
      .then((response) => {
        console.log(response);
        step();
      })
      .catch((err) => { });
  }
  return (
    <div>
      <IconButton
        onClick={handleClickOpen}
        style={{ margin: 1 }}
        size="small"
        edge="end"
        aria-label="share"
      >
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Share message</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Enter a channel below to share the message to
            </DialogContentText>
            <Select style={{ width: "100%" }} id="u_id" onChange={handleChannelSelect} value={selectedChannel}>
              {channels.map((d, idx) => {
                return <MenuItem key={d.channel_id} value={d.channel_id}>{d.name}</MenuItem>
              })}
            </Select>
            <br /><br />
            <DialogContentText>
              Optionally, enter an additional message
            </DialogContentText>
            <TextField
              multiline
              fullWidth
              rowsMax={4}
              value={message}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} type="submit" color="primary">
              Share
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default MessageShareDialog;
