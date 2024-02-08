import { CSpinner } from '@coreui/react';
import React from 'react';

const Loader = () => {
  return (
    <div className=" loader-overlay" >
      <CSpinner />
    </div>
  );
};

export default Loader;