import React, {useState, useEffect, useRef} from 'react';
import EmojiPicker from 'emoji-picker-react';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import MessageItem from '../MessageItem';
import api from '../../services/api';

import './style.css';

export default ({user, data}) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition !== undefined){
        recognition = new SpeechRecognition();
    }

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        setList([]);
        let unsub = api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    }, [data.chatId]);

   useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }  
   }, [list]);     

    const handleEmojiClick = (e, emojiObject) => {
        setText( text + emojiObject.emoji );
    }

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false);
    }

    const handleMicClick = () => {
        if(recognition !== null){
            recognition.onstart = () => {
                setListening(true);
            } 
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e) => {
                console.log(e);
                setText( e.results[0][0].transcript );
            }

            recognition.start();
        }
    }

    const handleInputKeyUp = (e) => {
        if(e.keyCode == 13){
            handleSendClick();
        }
    }

    const handleSendClick = () => {
        if(text !== ''){
            api.sendMessage(data, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    }

    return (
        <div className='chatWindow'>
            <div className='chatWindow--header'>
                <div className='chatWindow--headerInfo'>
                    <img className='chatWindow-avatar' src={data.image} alt='' />
                    <div className='chatWindow-name'>
                        {data.title}
                    </div>
                </div>
                <div className='chatWindow--headerButtons'>
                    <div className='chatWindow--btt'>
                        <SearchIcon style={{color: '#919191'}} />
                    </div>
                    <div className='chatWindow--btt'>
                        <AttachFileIcon style={{color: '#919191'}} />
                    </div>
                    <div className='chatWindow--btt'>
                        <MoreVertIcon style={{color: '#919191'}} />
                    </div>
                </div>
            </div>

            <div  ref={body} className='chatWindow--body'>
                {list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            <div className='chatWindow--emojiarea' style={{height: emojiOpen ? '200px': '0'}}>
                <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>

            <div className='chatWindow--footer'>
                <div className='chatWindow--pre'>
                    <div className='chatWindow--btt' onClick={handleCloseEmoji} style={{width: emojiOpen ? 40: 0}}>
                        <CloseIcon style={{color: '#919191'}} />
                    </div> 
                    <div className='chatWindow--btt' onClick={handleOpenEmoji}>
                        <InsertEmoticonIcon style={{color: emojiOpen ? '#009688' : '#919191'}} />
                    </div>  
                </div>
                <div className='chatWindow--inputarea'>
                    <input 
                        className='chatWindow--input' 
                        type="text" 
                        placeholder='Digite uma mensagem' 
                        value={text}
                        onChange={e=>setText(e.target.value)} 
                        onKeyUp={handleInputKeyUp}  
                    />
                </div>
                <div className='chatWindow--pos'>

                    {text === '' && 
                        <div onClick={handleMicClick} className='chatWindow--btt'>
                            <MicIcon style={{color: listening ? '#126ece' : '#919191'}} />
                        </div>
                    }

                    {text !== '' && 
                        <div onClick={handleSendClick} className='chatWindow--btt'>
                            <SendIcon style={{color: '#919191'}} />
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}