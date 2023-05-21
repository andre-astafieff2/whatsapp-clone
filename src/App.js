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
          setaStatus(response.data.status)
          //console.log(response.data.status)
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

  return (
    <div>
      {
        status === "ERRO"
          ?
          <div>API fora do ar, tente mais tarde</div>
          :
          status === "waitForLogin"
            ?
            <div>aguarde a geração do QR Code</div>
            :
            status === "notLogged" || status === "qrReadFail"
              ?
              <Container>
                <div><img src="https://ws-bot-o7sd.onrender.com/qr" /></div>
              </Container>
              :
              status === 'successChat' || status === 'successPageWhatsapp'
                ?

                <Container>
                  <ClientesContext.Provider value={{lista, setLista}}>
                    <ContactListComponent />
                    <ConversationComponent />
                  </ClientesContext.Provider>
                </Container>

                :
                <div>aguarde o carregamento do sistema</div>
      }

    </div>
  );
}

export default App;
