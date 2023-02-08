import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import RealTimeSection from '~/components/real-time-section';

import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { Alert, Box, Button, Container, Grid } from '@mui/material';

interface ILayout {
  name?:string
}

export default function DefaultLayout (props: PropsWithChildren<ILayout>) {
  const router = useRouter();
  const onBack = () => {
    router.back();
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item sx={{display:"flex", alignItems:"center"}}>
          <Button onClick={onBack} variant="outlined" startIcon={<TurnLeftIcon />}>
            BACK
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Alert severity="info" sx={{textAlign:"center"}}>
            <RealTimeSection />
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{border:'1px dashed grey'}} margin="20px 0">
        {props.children}
      </Box>
    </Container>
  )
}