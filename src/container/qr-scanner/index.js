import React, { useRef, useState } from 'react';
import jsQR from "jsqr";
import styled from 'styled-components';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import QRCodeIcon from '../../component/qr-code';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Environment } from '../../environment';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

const QRCodeContainer = styled.div`
  height: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100vh;

  @media (min-width: 992px) {
    flex: 0 0 auto;
    width: 480px;
    min-height: 100vh;
  }

  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  padding-top: 2rem;
  padding-bottom: 2rem;

  video {
    width: 100%;
    margin-bottom: 2rem;
  }
  button {
    margin-bottom: 2rem;
  }
`;
const QRCodeButton = styled.button`
  background: none;
  border: none;
  &:disabled {
    opacity: 0.4;
  }
  img {
    width: 180px;
  }
`;

const FormContainer = styled(Container)`
  &[disabled] {
    opacity: 0.4;
  }
`;

const context = {};
export default function QRScanner() {
  const inputQuantityRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [processing, setProcessing] = useState(false);
  const [readingQrCode, setReadingQrCode] = useState(false);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState('');

  function cleanState() {
    setProduct({
      code: '',
      unit: '',
      unitType: '',
      description: '',
    });
    setQuantity('');
    setReadingQrCode(false);
  }

  function closeReadQRCode() {
    setReadingQrCode(false);
    clearInterval(context.loop);
    context.stream.getTracks().forEach(function (track) {
      if (track.readyState === 'live') {
        track.stop();
      }
    });
  }

  function getCode() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const context = canvas.getContext("2d");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code && code.data) {
      return code.data;
    }
    return null;
  }

  async function readQRCode() {
    setReadingQrCode(true);
    const constraints = {
      audio: false,
      video: {
        facingMode: 'environment'
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    context.stream = stream;
    
    const video = videoRef.current;
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();

    context.loop = setInterval(() => {
      const code = getCode();
      if (code) {
        const values = code.split(';');
        if (values.length !== 4) {
          alert(`Código ${code} não é um código válido`);
        } else {
          setProduct({
            code: values[0],
            unit: values[2],
            unitType: values[3],
            description: values[1],
          });
          inputQuantityRef.current.focus();
        }
        closeReadQRCode();
      }
    }, 2000);
  }

  async function sendData() {
    setProcessing(true);
    const row = {
      'CÓDIGO': product.code,
      'DESCRIÇÃO': product.description,
      'UND': product.unit,
      'QUANTITY': quantity,
    };
    const document = new GoogleSpreadsheet(Environment.spreadsheetId);
    try {
      await document.useServiceAccountAuth({
        client_email: Environment.clientEmail,
        private_key: Environment.privateKey,
      });
      await document.loadInfo();

      const sheet = document.sheetsById[Environment.sheetId];
      await sheet.addRow(row);
      cleanState();
    } catch (e) {
      alert('Um erro ocorreu ao enviar os dados!');
      console.error('Error: ', e);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Wrapper>
      <Row>
        <QRCodeContainer>
          {readingQrCode && (<VideoContainer>
            <video ref={videoRef} muted autoPlay></video>
            <Button variant="danger" onClick={() => closeReadQRCode()}>
              Cancelar
            </Button>
          </VideoContainer>)}
          <canvas ref={canvasRef} hidden></canvas>
          <QRCodeButton onClick={() => readQRCode()} disabled={product.code}>
            <QRCodeIcon />
          </QRCodeButton>
        </QRCodeContainer>
        <FormContainer disabled={!product.code}>
          <Form onSubmit={(e) => { e.preventDefault(); sendData();}}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Código</Form.Label>
                  <Form.Control type="text" readOnly value={product.code} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unidade</Form.Label>
                  <Form.Control type="text" readOnly value={product.unit} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control as="textarea" rows={3} readOnly value={product.description} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Informe a Quantidade de:
                    <br />
                    {product.unitType}
                  </Form.Label>
                  <Form.Control ref={inputQuantityRef} size="lg" type="tel" readOnly={processing} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-grid gap-2">
                  <br />
                  <Button variant="primary" type="submit" size="lg" disabled={!product.code}>
                    {!processing && 'Enviar'}
                    {processing && (<Spinner animation="border" role="status"></Spinner>)}
                  </Button>
                  <Button variant="light" disabled={!product.code || processing} onClick={() => cleanState()}>
                    Cancelar
                  </Button>
                  <br />
                </div>
              </Col>
            </Row>
          </Form>
        </FormContainer>
      </Row>
    </Wrapper>
  )
}
