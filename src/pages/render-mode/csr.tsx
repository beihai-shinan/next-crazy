import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useSimpleData from '~/hooks/use-simple-data';
import DefaultLayout from '~/layouts';

import { Alert, Box, Button, Chip, List, ListItem, ListItemText } from '@mui/material';

export default function CsrPage () {
  const {data, loading, error} = useSimpleData();
  const [buildTime, setBuildTime] = useState('');

  useEffect(() => {
    setBuildTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, [])

  return (
    <DefaultLayout>
      <Box>
        <Chip label={buildTime} />
      </Box>
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