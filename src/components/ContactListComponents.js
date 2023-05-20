import styled from "styled-components";
import React, { useEffect, useState, useContext } from "react";
import api from "./api";
import { ClientesContext } from "../context";

const Container = styled.div`
overflow: auto;
display:flex;
flex-direction: column;
height:100%;
width: 100%;
flex:0.8;
`;
const ProfileInfoDiv = styled.div`
display: flex;
flex-direction: row;
background: #ededed;
padding: 15px;
`;
const ProfileImage = styled.img`
 width: 40px;
 height: 40px;
 border-radius: 50%;
 `;
const SearchBox = styled.div`
display: flex;
background: #f6f6f6;
padding:10px ;
`;
export const SearchContainer = styled.div`
display: flex;
flex-direction: row;
background: white;
border-radius: 16px;
width: 100%;
padding: 20px 0;
`;
const SearchIcon = styled.img`
width: 28px;
height: 28px;
padding-left: 10px;
`;
export const SearchInput = styled.input`
width: 100%;
outline: none;
border: none;
padding-left: 15px;
font-size: 17px;
margin-left: 10px;
background: #e5ddd6;
`;
const ContactItem = styled.div`
    display: flex;
    flex-direction : row;
    border-bottom: 1px solid #f2f2f2;
    background: white;
    cursor: pointer;
    padding: 15px 12px;
`;

const ProfileIcon = styled(ProfileImage)` 
width: 38px;
height: 38px;
`;
const ContactName = styled.span`
width: 100%;
font-size: 16px;
color:black;
`;
const MessageText = styled.span`
width: 20%;
font-size: 14px;
margin-top: 3px;
color: rgba (0,0,0,0.8);
`;
const ContactInfo = styled.div`
display: flex;
flex-direction: column;
width: 100%;
margin: 0 19px;
`;

function ContactListComponent(props) {


  const [userdados, setuserdados] = useState([])
  const [chk, setChk] = useState([]);

  const {setLista} = useContext(ClientesContext)



  const toggleChange = (value) => {
    
    const currentIndex = chk.map(obj => obj.value).indexOf(value.value);
    //console.log(currentIndex)
    //const currentIndex = chk.indexOf(value);
    const newCheckbox = [...chk];

    if (currentIndex === -1) {
      newCheckbox.push(value);
    } else {
      newCheckbox.splice(currentIndex, 1);
    }

    setChk(newCheckbox);
    setLista(newCheckbox)
    
    
  }

  useEffect(() => {
    async function ContactList() {
      await api
        .get("/contatos")
        .then((response) => {
          setuserdados(response.data)
         // console.log(response.data)
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
        });
    }
      ContactList();
  
  }, []);


  return (
  
    <Container>
      <ProfileInfoDiv>
        <ProfileImage src={"/ok-svgrepo-com.svg"} />
        <ContactName>Whatsapp logado</ContactName>
      </ProfileInfoDiv>

      {userdados.map((dados) => (
      <ContactItem key={dados.id._serialized}>
        <ContactInfo>
          <ContactName>{dados.name}</ContactName>
          <MessageText>
          </MessageText>
        </ContactInfo>
        <MessageText>
          <div key={dados.name}>
            <input
              type="checkbox"
              checked={chk.map(obj => obj.value).indexOf(dados.id._serialized) === -1 ? false : true}
              onChange={() => toggleChange({label:dados.notifyName, value:dados.id._serialized})}
            />
          </div>
        </MessageText>
      </ContactItem>
    ))}
    </Container>
 
  );
};

export default ContactListComponent;

