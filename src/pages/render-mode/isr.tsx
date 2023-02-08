import dayjs from 'dayjs';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import DefaultLayout from '~/layouts';

import { Box, Chip } from '@mui/material';
import Button from '@mui/material/Button';

export default function IsrPage (props: {
  dateTime: string;
}) {
  const [buildTime, setBuildTime] = useState('');
  useEffect(() => {
    setBuildTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, [])
  return (
    <DefaultLayout>
      <Button variant="outlined">ISR</Button>
      <Box>
        <Chip label={`页面组件生成的时间:${props.dateTime}`} />
        <Chip label={`页面元素加载完成的时间:${buildTime}`} />
      </Box>
    </DefaultLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  console.log('isr getStaticProps');
  return {
    props: { dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') },
    revalidate: 20
  };
};