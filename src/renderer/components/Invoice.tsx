/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-named-as-default


import React, { useEffect, useRef, useState } from 'react';
import '@styles/invoice.scss';

import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography, Zoom } from '@mui/material';
import icons from './icons';
import LongMenu from './tools/Menu';

// import { Stack, TextField } from '@mui/material';


const Invoice: React.FC = () => {
    // const handleclick = () => {
    //     navigateTo('settings');

    // }

    return (
        <section id='component__container'>
                <section className='component__inner'>
                    <section className='container__center'>center invoice interface </section>
                    <section className='container__right'>right invoice interface</section>
                </section>
        </section >
    );
};

export default Invoice;
