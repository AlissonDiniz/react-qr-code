import { Container, Row, Col } from 'react-bootstrap';
import QRScanner from './container/qr-scanner';

function App() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Row className="justify-content-md-center">
            <Col>
              <Container>
                <QRScanner />
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
