import React, {useState, useEffect} from "react";

import './style.css';

import api from "../../services/api";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export default ({user, chatList, show, setShow}) => {

    const [list, setList] = useState([]);

    useEffect(() => {
        const getList = async () => {
            if(user !== null){
                let results = await api.getContactList(user.id);
                console.log(results);
                setList(results);
            }
        }
        getList();
    }, [user]);

    const addNewChat = async (user2) => {
        await api.addNewChat(user, user2);

        handleClose();
    }

    const handleClose = () => {
        setShow(false);
    }

    return(
        <div className="mewChat" style={{left: show ? 0: -435}}>
            <div className="newChat--head">
                <div onClick={handleClose} className="newChat--backbutton">
                   <ArrowBackIcon style={{color: '#fff'}} />   
                </div>
                <div className="newChat--headtitle">
                    Nova Conversa
                </div>
            </div>

            <div className="newChat--list">
                {list.map((item, key)=>(
                    <div className="newChat--item" key={key} onClick={()=>addNewChat(item)} >
                        <img className="newChat--itemavatar" src={item.avatar} alt="" />
                        <div className="newChat--itemname">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}