import {io,Socket} from 'socket.io-client';
import {ReactNode, createContext} from 'react';

const socket = io(process.env.WEBSOCKETURL!);
const ServerContext = createContext<Socket>(socket);

const ServerProvider = (props:{children:ReactNode})=>{
  socket.on("hello", (arg)=>{
    console.log(arg);
  });

  return <ServerContext.Provider value={socket}>{props.children}</ServerContext.Provider>
}

export default ServerProvider;

