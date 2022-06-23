import { useEffect, useState } from 'react';

interface IOptions {
  during?: number;
  showError?: boolean;
}
interface IData {
  name: string;
  age: number;
}

export default function useSimpleData(options?: IOptions) {
  const { during=3000, showError } = options || {};
  const [data, setData] = useState<IData[]>([]);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const getData = ():Promise<IData[]> => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if(showError) {
          rej('error');
        } else {
          const data = new Array(100).fill(0).map((_, i) => {
            return {
              name: `张${i}`,
              age: 18 + i,
            }
          });
          res(data);
        }
      }, during);
    })
  }

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getData();
        setLoading(false);
        setData(data);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }
    init()
  }, [])

  return {
    data,
    error,
    loading,
  }
}