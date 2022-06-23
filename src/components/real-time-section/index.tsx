import useRealTime from '~/hooks/use-real-time';

export default function RealTimeSection () {
  const {realTime} = useRealTime();
  return (
    <div>
      <div>现在时间: {realTime}</div>
    </div>
  )
}