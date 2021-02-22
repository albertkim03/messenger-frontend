import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  Button,
  Grid,
  Link,
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import AddDmMemberDialog from './AddDmMemberDialog';
import DmMessages from './DmMessages';
import AuthContext from '../../AuthContext';
import { extractUId } from '../../utils/token';
import { useStep } from '../../utils/update';
import Placeholder from '../Placeholder';

function Dm({ dm_id, ...props }) {
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState('');
  const [members, setMembers] = React.useState([]);
  const token = React.useContext(AuthContext);

  function fetchDmData() {
    axios
      .get('/dm/details', {
        params: {
          token,
          dm_id: dm_id,
        },
      })
      .then(({ data }) => {
        const { name, all_members } = data;
        // assumes members of form [{ u_id, name_first, name_last }]
        setMembers(all_members);
        setName(name);
      })
      .catch((err) => {
        setMembers([]);
        setName('');
      })
      .finally(() => setLoading(false));
  }

  const step = useStep(fetchDmData, [dm_id, token], 2);

  function leaveDm(dm_id, token) {
    axios
      .post('/dm/leave', {
        token,
        dm_id: Number.parseInt(dm_id),
      })
      .then(() => {
        fetchDmData(dm_id, token);
      })
      .catch((err) => { });
  }

  return <>
    {loading
      ? <Placeholder />
      : <>
        <Typography variant="h4">{name.toUpperCase()}</Typography>
        <List subheader={<ListSubheader>Members</ListSubheader>}>
          {members.map(({ u_id, name_first, name_last, profile_img_url }) => (
            <ListItem key={u_id}>
              <ListItemAvatar>
                <Avatar style={{ width: "50px", height: "50px", border: "1px solid #ccc" }} src={profile_img_url}>
                  {[name_first, name_last].filter(s => s != null && s !== '').map(s => s[0]).join('')}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Link
                          href={`/profile/${u_id}`}
                        >{`${name_first} ${name_last}`}</Link>
                      </Grid>
                    </Grid>
                  </>
                }
              />
            </ListItem>
          ))}
          <ListItem key="leave_dm">
            <Grid container spacing={1}>
              <Grid item>
                <AddDmMemberDialog dm_id={dm_id} />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => leaveDm(dm_id, token)}
                >
                  Leave Dm
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        </List>
        <DmMessages dm_id={dm_id} />
      </>
    }
  </>;
}

export default Dm;
