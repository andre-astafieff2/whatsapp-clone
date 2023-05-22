import styled from "styled-components";
import ContactListComponent from "./components/ContactListComponents";
import ConversationComponent from "./components/ConversationComponents";
import React, { useEffect, useState } from "react";
import api from "./components/api";
import { ClientesContext, ClientesProvinder } from "./context";

const Container = styled.div`
display : flex;
flex-direction: row;
height: 100vh;
width: 100%;
background: #f8f9fb;
`;



function App() {

  const [status, setaStatus] = useState();
  const [lista, setLista] = useState([])


  useEffect(() => {
    async function StatusWS() {
      await api
        .get("/sts")
        .then((response) => {
          setaStatus(response.data)

          //console.log("chamou api", response.data)

        })
        .catch((err) => {
          setaStatus('ERRO')
        });
    }

    const intervalTeste = setInterval(() => {
      StatusWS()
      //console.log('eis o status', status)
    }, 5000);

    if (status === 'successChat') {
      return (() => {
        clearInterval(intervalTeste)
      })
    }

    //console.log(status)

  }, []);

  useEffect(() => {


    console.log(status)

  }, [status]);

  const testeRender = (status) => {
    if (status === "ERRO") {
      return (
        <div>API fora do ar, tente mais tarde</div>
      )
    } else if (status === "waitForLogin" || status === "notLogged" || status === "qrReadFail" || status === "deviceNotConnected") {
      return (
        <Container>
          <div><img src="http://ec2-3-136-22-22.us-east-2.compute.amazonaws.com:5000/qr" /></div>
        </Container>
      )
    } else if (status === "waitChat") {
      return (
        <div>Aguarde...</div>
      )
    } else if (status === "chatsAvailable" || status === "successChat") {
      return (
        <Container>
          <ClientesContext.Provider value={{ lista, setLista }}>
            <ContactListComponent />
            <ConversationComponent />
          </ClientesContext.Provider>
        </Container>
      )
    } else {
      return (
        <div>aguarde o carregamento do sistema</div>
      )
    }
  }



  return (
    <div>
      {testeRender(status)}
    </div>
  );
}

export default App;
