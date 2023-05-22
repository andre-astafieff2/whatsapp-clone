import styled from "styled-components";
import { messagesList } from "../Data";
import { SearchInput } from "./ContactListComponents";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, List, Row, Col, Space, FloatButton } from 'antd';
import { ClientesContext } from "../context";
import { Typography, Form, Button, Input, Select } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import api from "./api";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const Container = styled.div`
display: flex ;
flex-direction: column;
height: 100%;
flex: 2;
background: #f6f7f8;
`;
const ProfileHeader = styled.div`
    display: flex;
    flex-direction: row;
    background: #ededed;
    padding: 15px;
    align-items: center;
    gap : 10px;
`;

const ProfileImage = styled.img`
width: 40px;
height: 40px;
border-radius: 50%;
`;

const ChatBox = styled.div`
display: flex;
background: #e5ddd6;
padding: 10px;
align-items: center;
bottom : 0;
`;

const EmojiImage = styled.img`
width:30px;
height: 28px;
opacity: 0.4;
cursor: pointer;
`;
const MessageContainer = styled.div`
display: flex;
flex-direction: column;
height: 100%;
background: #e5ddd6;
`;

const MessageDiv = styled.div`
justify-content: 'flex-start';
display:flex;
margin: 5px 16px;
`;

const Message = styled.div`
background: "white";
max-width:50%;
color: #303030;
padding: 8px 10px;
font-size: 19px;
`;

const { Title } = Typography;
const { TextArea } = Input;


const ConversationComponent = () => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPost, setPreviewPost] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [listaenvio, setListaEnvio] = useState('Aguarde...')
    const [somaLista, addlista] = useState(0);
    const handleCancel = () => setPreviewOpen(false);
    const fechaPost = () => setPreviewPost(false);
    const tagUpload = "http://ec2-3-136-22-22.us-east-2.compute.amazonaws.com:5000/file"

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Selecione a imagem
            </div>
        </div>
    );

    //const [novaCampanha, setaCampanha] = useState("campanha");
    const [novaCampanha, setaCampanha] = useState(null);

    const imageClick = () => {
        setaCampanha(null);
    }

    const { lista } = useContext(ClientesContext) //dados dos selecionados que vem no contexto

    useEffect(() => {
        //console.log("itens enviados", listaenvio)

    }, [listaenvio]);

    async function FormPost(fields) {

        

        async function postImage(contact, name, image, label) {
            const valorEnvio = { "contact": contact, "name": name, "image": image, "label": label }
            setListaEnvio('Preparando envio para: ' + name)
            await api
                .post("/imageMessage", valorEnvio)
                .then((response) => {
                    //setuserdados(response.data);
                    setListaEnvio('Enviado para: ' + name)
                    //console.log(response)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
        }

        const timer = (seconds) => {
            let time = seconds * 1000;
            return new Promise(res => setTimeout(res, time));
        };

        //const conteudoPost = [{
        //    data:{
        //        message: fields.mensagem,
        //        imgname: fields.upload.file.name,
        //        img64: fields.upload.file.thumbUrl
        //    },
        //    contacts: lista
        //}]
        //console.log(conteudoPost)
        setPreviewPost(true)

        for (const valores of lista) {

            await postImage(valores.value, valores.label, fields.upload.file.name, fields.mensagem);
            addlista(somaLista+1)
            await timer(5)

            if(somaLista === 4) {
                await timer(30);
                addlista(0)
            }
            

        }

        setPreviewPost(false)
        setListaEnvio('Aguarde...')

        //api.post()
    }

    const ErroPost = (errorInfo) => {
        console.log(errorInfo)
    }


    return (
        <Container>
            <ProfileHeader>
                <ProfileImage src={"/logo512.png"} />
                Histórico de Envios
            </ProfileHeader>
            {
                novaCampanha

                    ?
                    <MessageContainer>
                        {messagesList.map((messageData) => (
                            <MessageDiv isYours={messageData.id}>
                                <EmojiImage src={"/target-svgrepo-com.svg"} />
                                <Message >{messageData.conteudoCampanha}<br />{messageData.diaHoraEnvio} </Message>
                            </MessageDiv>
                        ))}
                    </MessageContainer>
                    :
                    <MessageContainer>
                        <MessageDiv>
                            <Form
                                layout="vertical"
                                name="frmPost"
                                autoComplete="off"
                                onFinish={FormPost}
                                onFinishFailed={ErroPost}
                            >
                                <Row>
                                    <Title level={2}>Nova Campanha</Title>
                                </Row>
                                <Row>
                                    <Form.Item
                                        name="upload"
                                    >
                                        <Upload
                                            name="file"
                                            action={tagUpload}
                                            listType="picture-circle"
                                            fileList={fileList}
                                            onPreview={handlePreview}
                                            onChange={handleChange}
                                        >
                                            {fileList.length >= 8 ? null : uploadButton}
                                        </Upload>
                                    </Form.Item>
                                </Row>
                                <Row>

                                    <Form.Item label="Digite o conteúdo da mensagem..." name="mensagem">
                                        <TextArea rows={6} style={{ width: 520, resize: 'none' }} />
                                    </Form.Item>
                                </Row>
                                <Row>
                                    <Button type="primary" htmlType="submit" icon={<ThunderboltOutlined />} size={18}>Enviar mensagem</Button>


                                </Row>
                                <Row>
                                    <List
                                        dataSource={lista}
                                        pagination={{
                                            //onChange: (page) => {
                                            //  console.log(page);
                                            //},
                                            pageSize: 3,
                                        }}
                                        renderItem={(item, index) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={item.label}
                                                    description={item.value}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Row>
                                <Space />

                            </Form>
                            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img
                                    alt="example"
                                    style={{
                                        width: '100%',
                                    }}
                                    src={previewImage}
                                />
                            </Modal>
                            <Modal open={previewPost} title="Enviando mensagens..." footer={null} onCancel={fechaPost}>
                                {listaenvio}
                            </Modal>
                        </MessageDiv>
                    </MessageContainer>
            }
            <ChatBox>
                <EmojiImage src={"/add-square-svgrepo-com.svg"} onClick={() => imageClick()} />
                <SearchInput placeholder="Criar nova campanha" />
            </ChatBox>
        </Container>
    );
};
export default ConversationComponent;