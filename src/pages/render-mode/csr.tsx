import useSimpleData from '~/hooks/use-simple-data';
import DefaultLayout from '~/layouts';

import { Alert, Button, List, ListItem, ListItemText } from '@mui/material';

export default function CsrPage () {
  const {data, loading, error} = useSimpleData();

  return (
    <DefaultLayout>
      {
        loading ? '加载中...' :
        error ? <Alert severity="error">{error}</Alert> : (
          <List sx={{border:'1px dashed grey'}}>
            {data.map(item => (
                <ListItem key={item.age}><ListItemText>{item.name}</ListItemText></ListItem>
            ))}
          </List>
        )
      }
    </DefaultLayout>
  )
}