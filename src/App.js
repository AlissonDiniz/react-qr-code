import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import QRScanner from './container/qr-scanner';
import Login from './container/login';

function App() {
  const [principal, setPrincipal] = useState(undefined);

  function signIn(username, count) {
    setPrincipal({username, count});
  }

  function signOut() {
    setPrincipal(undefined);
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <Row className="justify-content-md-center">
            <Col>
              <Container>
                {principal ? <QRScanner principal={principal}  signOut={signOut} /> : <Login signIn={signIn} />}
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
