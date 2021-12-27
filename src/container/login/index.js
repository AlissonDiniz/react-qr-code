import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import LogoIcon from '../../component/logo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

const Logo = styled(LogoIcon)`
   width: 200px;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin-bottom: 40px;
`;

const FormContainer = styled(Container)`
  &[disabled] {
    opacity: 0.4;
  }
`;

export default function Login({ signIn }) {
  const [username, setUsername] = useState('');
  const [count, setCount] = useState('PRIMEIRA');

  async function logIn() {
    signIn(username, count)
  }

  return (
    <Wrapper>
      <Row>
        <Logo />
        <Title>Lançar Inventário</Title>
        <FormContainer>
          <Form onSubmit={(e) => { e.preventDefault(); logIn(); }}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control type="text" size="lg" style={{ textTransformation: 'uppercase' }} required value={username} onChange={(e) => setUsername(e.target.value ? e.target.value.toUpperCase() : '')} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Contagem</Form.Label>
                  <Form.Select size="lg" value={count} onChange={(e) => setCount(e.target.value)}>
                    <option value="PRIMEIRA">PRIMEIRA</option>
                    <option value="SEGUNDA">SEGUNDA</option>
                    <option value="TERCEIRA">TERCEIRA</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-grid gap-2">
                  <br />
                  <Button variant="primary" type="submit" size="lg">
                    Entrar
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </FormContainer>
      </Row>
    </Wrapper>
  )
}
