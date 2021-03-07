import React from "react";
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Button,
  Select,
  Input,
  MenuItem
} from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import AuthContext from "../../AuthContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AddDmDialog({ ...props }) {
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [users, setUsers] = React.useState([]);

  const token = React.useContext(AuthContext);

  function fetchUserData() {
    axios
      .get('/users/all/v1', {
        params: {
          token,
        },
      })
      .then(({ data }) => {
        setUsers(data['users']);
      })
      .catch((err) => { });
  }

  React.useEffect(() => {
    fetchUserData();
  }, []);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleUserSelect(event) {
    setSelectedUsers(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const secret = event.target[1].checked;
    const is_public = !secret;

    if (!name) return;

    axios
      .post(`/dm/create/v1`, { token, selectedUsers })
      .then(response => {
        console.log(response);
        props.callback();
      })
      .catch(err => { });
  }
  return (
    <div>
      <IconButton size="small" onClick={handleClickOpen}>
        <Add />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Dm</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Select the users below to create a new dm
            </DialogContentText>
            <Select
              multiple
              value={selectedUsers}
              onChange={handleUserSelect}
              input={<Input />}
              MenuProps={MenuProps}
              style={{ width: "100%" }}
            >
              {users.map((d, idx) => (
                <MenuItem key={d.u_id} value={d.u_id}>{d.name_first + ' ' + d.name_last}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default AddDmDialog;
