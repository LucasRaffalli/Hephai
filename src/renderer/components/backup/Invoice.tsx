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


const Invoice: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const handleclick = () => {
        navigateTo('settings');

    }

    return (
        <section id='container'>
            <section id='container__inner__1'>
                <section className='inner__top'>
                    <img src={icons.hephai_icon} />
                </section>
                <section className='inner__bottom'>
                    <section className='container__left'>
                        <div className='client__information'>
                            <div className='title'>CLIENTS</div>
                            <section className='list__client'>
                                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                    <section className='card__base'>
                                        <div className='card__inner'>
                                            <div className='card__top'>
                                                <span className='card__title'>test</span>
                                                <LongMenu />
                                            </div>
                                            <div className='card__bottom'>
                                                <span className='card__description'>
                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione consectetur quaerat, id magni, possimus dignissimos repellat, minus ipsa nam obcaecati suscipit totam. Rem minima voluptates quia, tenetur laudantium quasi a.
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className='card__base'>
                                        <div className='card__inner'>
                                            <div className='card__top'>
                                                <span className='card__title'>test</span>
                                                <LongMenu />
                                            </div>
                                            <div className='card__bottom'>
                                                <span className='card__description'>
                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione consectetur quaerat, id magni, possimus dignissimos repellat, minus ipsa nam obcaecati suscipit totam. Rem minima voluptates quia, tenetur laudantium quasi a.
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className='card__base'>
                                        <div className='card__inner'>
                                            <div className='card__top'>
                                                <span className='card__title'>test</span>
                                                <LongMenu />
                                            </div>
                                            <div className='card__bottom'>
                                                <span className='card__description'>
                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione consectetur quaerat, id magni, possimus dignissimos repellat, minus ipsa nam obcaecati suscipit totam. Rem minima voluptates quia, tenetur laudantium quasi a.
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className='card__base'>
                                        <div className='card__inner'>
                                            <div className='card__top'>
                                                <span className='card__title'>test</span>
                                                <LongMenu />
                                            </div>
                                            <div className='card__bottom'>
                                                <span className='card__description'>
                                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione consectetur quaerat, id magni, possimus dignissimos repellat, minus ipsa nam obcaecati suscipit totam. Rem minima voluptates quia, tenetur laudantium quasi a.
                                                </span>
                                            </div>
                                        </div>
                                    </section>


                                </List>

                            </section>
                        </div>
                        <div className='action__button'>
                            <div className='button__top'>
                                <Tooltip TransitionComponent={Zoom} enterDelay={700} leaveDelay={200} title="Exporter la facture" arrow>
                                    <button>Exporter la facture</button>
                                </Tooltip>
                            </div>

                            <Divider />
                            <div className='button__bottom'>
                                <Tooltip TransitionComponent={Zoom} enterDelay={700} leaveDelay={200} title="Parametres" arrow>
                                    <button onClick={handleclick} ><img src={icons.setting} /></button>
                                </Tooltip>
                                <Tooltip TransitionComponent={Zoom} enterDelay={700} leaveDelay={200} title="Ajouter une colonne" arrow>
                                    <button><img src={icons.add_colonne} /></button>
                                </Tooltip>
                                <Tooltip TransitionComponent={Zoom} enterDelay={700} leaveDelay={200} title="Ajouter un client" arrow>
                                    <button><img src={icons.add_client} /></button>
                                </Tooltip>
                                <Tooltip TransitionComponent={Zoom} enterDelay={700} leaveDelay={200} title="Ajouter un produit" arrow>
                                    <button><img src={icons.add_product} /></button>
                                </Tooltip>
                            </div>
                        </div>
                    </section>
                    <section className='container__center'>center</section>
                    <section className='container__right'>right</section>
                </section>
            </section>
        </section >
    );
};

export default Invoice;
