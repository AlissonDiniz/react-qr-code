import React from 'react';
import styled from 'styled-components';
import { Row, Stack, Spinner } from 'react-bootstrap';
import LogoIcon from '../logo';

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
const CustomStack = styled(Stack)`
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
  span {
    margin-left: 20px;
  }
`;

export default function LoadingStack() {
  return (
    <Wrapper>
      <Row>
        <Logo />
        <Title>Lançar Inventário</Title>
        <CustomStack direction="horizontal">
          <Spinner animation="border" role="status"></Spinner><span>Carregando...</span>
        </CustomStack>
      </Row>
    </Wrapper>
  )
}
