import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import QRScanner from './container/qr-scanner';
import Login from './container/login';

import LoadingStack from './component/loading-stack';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Environment } from './environment';

function App() {
  const [loading, setLoading] = useState(true);
  const [principal, setPrincipal] = useState(undefined);
  const [settings, setSettings] = useState({ users: [], counts: [] });

  useEffect(async () => {
    const document = new GoogleSpreadsheet(Environment.spreadsheetId);
    await document.useServiceAccountAuth({
      client_email: Environment.clientEmail,
      private_key: Environment.privateKey,
    });
    await document.loadInfo();

    const sheet = document.sheetsById[Environment.sheetIdSettings];
    const rows = await sheet.getRows();

    const newSettings = { users: rows[0]['VALOR'].split(','), counts: rows[1]['VALOR'].split(',') };
    setSettings(newSettings);
    setLoading(false);
  }, []);

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
              {loading && <LoadingStack />}
              {!loading && (principal ? <QRScanner principal={principal} signOut={signOut} /> : <Login settings={settings} signIn={signIn} />)}
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
