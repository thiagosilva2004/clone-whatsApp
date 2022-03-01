import React, {useEffect, useState} from 'react';

import './App.css';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

import Login from './componets/Login';
import api from './services/api';

import ChatListItem from './componets/ChatListItem';
import ChatInto from './componets/ChatIntro';
import ChatWindow from './componets/ChatWindow';
import NewChat from './componets/NewChat';

export default () => {

  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(()=>{
    if(user !== null){
      let unsub =  api.onChatList(user.id, setChatList);
      return unsub;
    }
  }, [user]);

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    };
    await api.addUser(newUser);
    setUser(newUser);
  }

  if(user === null){
    return (<Login onReceive={handleLoginData} />);
  }

  return (
    <div className='app-window'>

      <div className='sidebar'>
        {showNewChat &&
          <NewChat 
            chatlist={chatList}
            user={user}
            show={showNewChat}
            setShow={setShowNewChat}
          />
        }


        {!showNewChat &&
          <header>
            <img className='header--avatar' src={user.avatar} alt='perfil' />
            <div className='header--buttons'>
              <div className='header--btn'>
                <DonutLargeIcon style={{color: '#919191'}} />
              </div>
              <div className='header--btn'>
                <ChatIcon onClick={handleNewChat} style={{color: '#919191'}} />
              </div>
              <div className='header--btn'>
                <MoreVertIcon style={{color: '#919191'}} />
              </div>
            </div>
          </header>
        }

        {!showNewChat && 
          <div className='search'>
            <div className='search--input'>
              <SearchIcon fontSize='small' style={{color: '#919191'}} />
              <input type="search" placeholder='Procurar ou começar uma nova conversa' />
            </div>
          </div>
        }

        {!showNewChat &&
          <div className='chatList'>
            {chatList.map( (item, key) => (
              <ChatListItem
                key={key}
                data={item}
                active={activeChat.chatId === chatList[key].chatId}
                onClick={()=>setActiveChat(chatList[key])}
              />
            ))}
          </div>
        }


      </div>

      <div className='contentarea'>
        {activeChat.chatId !== undefined &&
          <ChatWindow 
            user={user}
            data={activeChat}
          />
        }
        {activeChat.chatId === undefined &&
          <ChatInto />
        }
        
      </div>

    </div>
  );

}