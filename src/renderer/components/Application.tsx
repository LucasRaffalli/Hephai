import React, { } from 'react';
import '@styles/app.scss';
import InvoiceForm from './InvoiceFrom';

// import { Link } from 'react-router-dom';
// import icons from '@components/icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Application: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {

  return (
    <section id='erwt'>

      <InvoiceForm />

    </section>
  );
};

export default Application;
