import { useRef, useEffect } from 'react';

const useServer = ({ url }: { url: string }) => {
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket(url);


      const cur = socket.current;

      return () => {
        cur.close();
      }
    }
  }, [socket, url]);

  useEffect(()=>{
    if(socket.current) {
      socket.current.onmessage = (e) => console.log(e);
    }
  }, [socket.current]);

  return socket;
}

export default useServer;
