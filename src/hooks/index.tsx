import React from 'react';

import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children: Children }) => {
  return <AuthProvider>{Children}</AuthProvider>;
};

export default AppProvider;
