import React from 'react';

import { Text } from 'react-native';

import { useAuth } from '../../hooks/auth';

import { Container } from './styles';
import Button from '../../components/Button';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Container>
      <Text>Dashboard</Text>
      <Button onPress={signOut}>Sair</Button>
    </Container>
  );
};

export default Dashboard;
