/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-named-as-default
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useEffect, useRef, useState } from 'react';
import '@styles/invoice.scss';
import { Client } from '../../typings/client';
import canvg from 'canvg';
import icons from './icons';
import { Stack, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const InvoiceFormFormated: React.FC = () => {
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [mailClient, setMailClient] = useState('');
    const [clients, setClients] = useState(() => {
        const savedClients = localStorage.getItem('clients');
        return savedClients ? JSON.parse(savedClients) : [];
    });
    const [selectedClientIndex, setSelectedClientIndex] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState(0);
    const [formattedInvoiceNumber, setFormattedInvoiceNumber] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const defaultHeaders = ['produit', 'heures', 'tarifs'];
    const [headers, setHeaders] = useState<string[]>(defaultHeaders);
    const [newHeader, setNewHeader] = useState('');
    const [productValues, setProductValues] = useState<Record<string, string>>({});
    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });
    const [maxDay, setMaxDay] = useState('');
    const [textDelay, setTextDelay] = useState('');
    const [showMaxDay, setShowMaxDay] = useState(true);
    const [showTextDelay, setShowTextDelay] = useState(true);
    //?authers
    const [siret, setSiret] = useState("");
    const [mailAuthor, setMailAuthor] = useState("");
    //?CalculTarifs
    const [tvaRate, setTvaRate] = useState(0.2);
    const totalHT = products.reduce((total: number, product: { tarifs: string; }) => {
        const tarifs = Number(product.tarifs.replace(',', '.').replace(' €', ''));
        return total + (isNaN(tarifs) ? 0 : tarifs);
    }, 0);
    const tva = totalHT * tvaRate;
    const totalTTC = totalHT + tva;
    function formatCurrency(value: number): string {
        return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €';
    }
    const totalHTFormatted = formatCurrency(totalHT);
    const tvaFormatted = formatCurrency(tva);
    const totalTTCFormatted = formatCurrency(totalTTC);
    //? others
    const [errorMessage, setErrorMessage] = useState<{ field: string, message: string } | null>(null);
    const [image] = useState<string | null>(null);
    //?modal
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showAddHeaderModal, setShowAddHeaderModal] = useState(false);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState<Record<string, any> | null>(null);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [bankDetails, setBankDetails] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');


    //! HEADER --------------------------------------------------------------------------------------------------------------------------------
    const handleAddHeader = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newHeader) {
            setHeaders([...headers, newHeader]);
            setNewHeader('');
        }
        setShowAddHeaderModal(false);
    };
    const removeHeader = (header: string) => {
        setHeaders(prevHeaders => {
            const newHeaders = prevHeaders.filter(h => h !== header);
            localStorage.setItem('headers', JSON.stringify(newHeaders));
            return newHeaders;
        });
    };
    useEffect(() => {
        const savedHeaders = localStorage.getItem('headers');
        if (savedHeaders) {
            setHeaders(JSON.parse(savedHeaders));
        } else {
            setHeaders(defaultHeaders);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('headers', JSON.stringify(headers));
    }, [headers]);


    //! PRODUCT --------------------------------------------------------------------------------------------------------------------------------
    const handleAddProduct = (event: React.FormEvent) => {
        event.preventDefault();
        if (!productValues.tarifs) {
            setErrorMessage({ field: 'tarifs', message: 'Le tarifs est obligatoire' });
            return;
        }
        const tarifsValue = Number(productValues.tarifs.replace(',', '.'));
        if (isNaN(tarifsValue)) {
            setErrorMessage({ field: 'tarifs', message: 'Le tarifs doit être un nombre' });
            return;
        }
        const tarifs = formatCurrency(tarifsValue);
        setProducts((prevProducts: Record<string, string>[]) => {
            const newProducts = [...prevProducts, { ...productValues, tarifs }];
            localStorage.setItem('products', JSON.stringify(newProducts));
            return newProducts;
        });
        setProductValues({});
        setErrorMessage(null);
        setShowAddProductModal(false);
    };
    const handleRemoveProduct = (index: number) => {
        setProducts((prevProducts: Record<string, string>[]) => prevProducts.filter((product, i) => i !== index));
        localStorage.setItem('products', "");
    };
    const handleProductInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductValues({
            ...productValues,
            [event.target.name]: event.target.value
        });
    };
    useEffect(() => {
        const date = new Date();
        const newFormattedInvoiceNumber = `N° de facture ${date.getFullYear()}${String(invoiceNumber).padStart(4, '0')}`;
        setFormattedInvoiceNumber(newFormattedInvoiceNumber);
    }, [invoiceNumber]);

    //! BANK DETAILS --------------------------------------------------------------------------------------------------------------------------
    const handlePaypalEmailChange = (e: any) => {
        setPaypalEmail(e.target.value);
    }
    const handlePaymentMethodChange = (e: any) => {
        setPaymentMethod(e.target.value);
    }
    const handleBankDetailsChange = (e: any) => {
        setBankDetails(e.target.value);
    }

    //! CLIENT --------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    const handleDeleteClient = (index: number) => {
        setClients(clients.filter((_: Client, i: number) => i !== index));
        if (index === selectedClientIndex) {
            setCompanyName('');
            setPhoneNumber('');
            setAddress('');
            setMailClient('');
        }
    };
    const handleSelectClientBtn = (index: number) => {
        const selectedClient = clients[index];
        setCompanyName(selectedClient.companyName);
        setPhoneNumber(selectedClient.phoneNumber);
        setAddress(selectedClient.address);
        setMailClient(selectedClient.mailClient);
        setSelectedClientIndex(index);
    };
    const date = new Date();
    const formattedDate = `Date ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()}`;


    //! MODALS -------------------------------------------------------------------------------------------------------------------------------------
    const handleAddClientFromModal = (event: React.FormEvent) => {
        event.preventDefault();
        setClients([...clients, { companyName, phoneNumber, address, mailClient }]);
        setCompanyName('');
        setPhoneNumber('');
        setAddress('');
        setMailClient('');
        setShowAddClientModal(false);
    }; const [productToEdit, setProductToEdit] = useState<number | null>(null);


    //! OTHERS FONCTIONNALITES ----------------------------------------------------------------------------------------------------------------------
    const handleEditProduct = (index: number) => {
        setProductToEdit(index);
        setUpdatedProduct(products[index]); // initialise updatedProduct avec le produit à modifier
    };

    const handleProductChange = (value: string, property: string) => {
        if (updatedProduct !== null) {
            const newProduct = { ...updatedProduct, [property]: value };
            setUpdatedProduct(newProduct);
        }
    };
    const handleUpdateProduct = (event: React.FormEvent) => {
        event.preventDefault();
        if (productToEdit !== null && updatedProduct !== null) {
            const newProducts = [...products];
            newProducts[productToEdit] = updatedProduct;
            setProducts(newProducts);
            setProductToEdit(null);
            setUpdatedProduct({});
            localStorage.setItem('products', JSON.stringify(newProducts));
            setShowEditProductModal(false);
        }
    };
    const handleEditButtonClick = (index: number) => {
        setShowEditProductModal(true);
        handleEditProduct(index);
    };


    //! DOCUMENT PDF --------------------------------------------------------------------------------------------------------------------------------
    const exportDocument = async (event: React.FormEvent) => {
        event.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert('Veuillez télécharger un fichier.');
            return;
        }

        let imageUrl;
        if (file.name.endsWith('.svg')) {
            const reader = new FileReader();
            reader.readAsText(file);
            const svg = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
            });
            const canvas = document.createElement('canvas');
            canvg(canvas, svg);
            imageUrl = canvas.toDataURL('image/png');
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            imageUrl = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
            });
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const maxWidth = doc.internal.pageSize.getWidth();
        const maxHeight = doc.internal.pageSize.getHeight();
        console.log('largeur de la page' + maxWidth);
        console.log('hauteur de la page' + maxHeight);

        const date = new Date();
        const formattedDate = `Date ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()}`;
        const formattedInvoiceNumber = `N° de facture ${date.getFullYear()}${String(invoiceNumber).padStart(4, '0')}`;
        const numberOfInvoice = `${date.getFullYear()}${String(invoiceNumber).padStart(4, '0')}`;
        localStorage.setItem('invoiceNumber', numberOfInvoice);
        const img = new Image();
        img.src = imageUrl;
        await img.decode();

        const scaleFactor = 5;
        const pdfWidth = doc.internal.pageSize.getWidth() / scaleFactor;
        const pdfHeight = (img.height / img.width) * pdfWidth;

        doc.addImage(imageUrl, 'PNG', 10, 15, pdfWidth, pdfHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('FACTURE', 160, 25, null, null);

        //Information client
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(`FACTURÉ À`, 10, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${companyName}`, 10, 55);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${address}`, 10, 60);
        doc.text(`${mailClient}`, 10, 65);
        doc.text(`${formattedInvoiceNumber}`, 150, 55);
        doc.text(`${formattedDate}`, 150, 60);

        autoTable(doc, {
            theme: 'grid',
            columnStyles: { europe: { halign: 'center' } },
            startY: 90,
            margin: { left: 10, right: 10 },
            tableWidth: 'auto',
            head: [headers],
            body: products.map((product: Record<string, string>) => headers.map(header => product[header])),
            headStyles: {
                fillColor: [22, 22, 22], // Couleur de fond en noir
                textColor: [255, 255, 255], // Couleur du texte en blanc
            },
            didDrawPage: (data) => {
                const textY = Math.max(240, data.cursor.y + 25);
                const rectWidth = 100;
                const padding = 2;
                const conditionsText = !showMaxDay && !showTextDelay ?
                    doc.splitTextToSize(`Aucune Conditions & Modalités`, rectWidth - 2 * padding) :
                    doc.splitTextToSize(`Conditions & Modalités`, rectWidth - 2 * padding);
                const delayText = showMaxDay ? doc.splitTextToSize(`Délai de règlement : ${maxDay} jours`, rectWidth - 2 * padding) : [];
                const delayPaymentText = showTextDelay ? doc.splitTextToSize(`En cas de retard de paiement : ${textDelay}`, rectWidth - 2 * padding) : [];

                const paymentMethodText = paymentMethod === 'bankTransfer' ? 'virement bancaire' : 'PayPal';
                const paymentInfoText = paymentMethod === 'bankTransfer' ? doc.splitTextToSize(`IBAN: ${bankDetails}`, rectWidth - 2 * padding) : doc.splitTextToSize(`${paypalEmail}`, rectWidth - 2 * padding);

                const fullPaymentText = doc.splitTextToSize(`Ce paiement sera effectué par ${paymentMethodText}. ${paymentInfoText}`, rectWidth - 2 * padding);

                const textHeight = conditionsText.length + delayText.length + delayPaymentText.length + paymentInfoText.length + fullPaymentText.length;

                const rectHeight = textHeight * 5 + 2 * padding;

                doc.rect(10, textY - 5, rectWidth, rectHeight);
                doc.text(conditionsText, 10, textY - 7);

                doc.text(delayText, 10 + padding, textY + 0 + padding);
                doc.text(delayPaymentText, 10 + padding, textY + 5 + padding);
                doc.text(fullPaymentText, 10 + padding, textY + 10 + padding);

                const pageWidth = doc.internal.pageSize.getWidth();

                const totalHTText = `Sous-total HT: ${totalHTFormatted}`;
                const tvaText = `TVA: ${tvaFormatted}`;
                const totalTTCText = `Total TTC: ${totalTTCFormatted}`;
                const soldePayerText = `Solde à payer: ${totalTTCFormatted}`;

                const fontSize = 12;
                doc.setFontSize(fontSize);

                const totalHTTextWidth = doc.getStringUnitWidth(totalHTText) * fontSize / doc.internal.scaleFactor;
                const tvaTextWidth = doc.getStringUnitWidth(tvaText) * fontSize / doc.internal.scaleFactor;
                const totalTTCTextWidth = doc.getStringUnitWidth(totalTTCText) * fontSize / doc.internal.scaleFactor;
                const soldePayerTextWidth = doc.getStringUnitWidth(soldePayerText) * fontSize / doc.internal.scaleFactor;

                doc.text(totalHTText, pageWidth - totalHTTextWidth - 10, textY - 7);
                doc.text(tvaText, pageWidth - tvaTextWidth - 10, textY - -1);
                doc.text(totalTTCText, pageWidth - totalTTCTextWidth - 10, textY - -7);
                doc.text(soldePayerText, pageWidth - soldePayerTextWidth - 10, textY - -13);

            },
        });
        //? corriger le bug du text qui sort de la page quand le tableau est trop grand 
        //? le texte doit rajouter sur la 2eme page si le tableau ne laisse pas la place sur la premiere page
        //! effacer l'arnaque des coordonnées du text 

        const fontSize = 12;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerTextAuthor = `SIRET: ${siret} | ${mailAuthor}`;
        const siretTextWidth = doc.getStringUnitWidth(footerTextAuthor) * fontSize / doc.internal.scaleFactor;

        const textX = (pageWidth - siretTextWidth) / 2;

        doc.text(footerTextAuthor, textX, pageHeight - 10);

        doc.save(`Facture_${companyName}_${numberOfInvoice}.pdf`);
        setInvoiceNumber(invoiceNumber + 1);
    };

    return (
        <section id='container'>
            <section className='left'>
                <div className='top'>

                    <div className='hephai'>
                        <img src={icons.hephai_icon} alt="" />
                    </div>
                </div>
                <div className="container">

                    <h2>Clients enregistrés :</h2>
                    <div className="sidebar">
                        {clients.map((client: Client, index: number) => (
                            <div key={index} className='container_information'>
                                <h2>{client.companyName}</h2>
                                <div className='inner__information'>
                                    <button type="button" onClick={() => handleDeleteClient(index)}>
                                        <img className='item-icon' src={icons.cross_icon} />
                                    </button>
                                    <button type="button" onClick={() => handleSelectClientBtn(index)}>
                                        Utiliser
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='btn__left'>
                    <button type="button" onClick={() => setShowAddProductModal(true)}><img src={icons.add_product} /><p>Ajouter un produit</p> </button>
                    <button type="button" onClick={() => setShowAddHeaderModal(true)}><img src={icons.add_colonne} /><p>Ajouter une colonne</p></button>
                    <button type="button" onClick={() => setShowAddClientModal(true)}><img src={icons.add_client} /><p>Ajouter un client</p></button>

                    <button type="submit" form='exportPdf' ><img src={icons.pdfExport_icon} /><p>Créer la facture</p></button>
                </div>

            </section>

            <section className='right'>
                <div className='container__paper'>
                    <section className='paper'>
                        <div className='paper__top'>
                            <section className='header__paper'>
                                <div className={`drop-container `} style={{ position: 'relative' }}>
                                    {!image && (
                                        <label>
                                            <p>Télécharger le logo :</p>
                                            <input type="file" ref={fileInputRef} accept=".svg,.png" />
                                        </label>
                                    )}

                                    {image && (
                                        <>
                                            <img src={image} alt="Logo" className="uploaded-image" />
                                        </>
                                    )}
                                </div>
                                <div>
                                    <h1>FACTURE</h1>
                                </div>
                            </section>
                            <section className='body__paper'>
                                <form id='exportPdf' onSubmit={exportDocument}>
                                    <div className='facture__container'>
                                        <Stack spacing={2} className='facture__client'>
                                            <h1>Facturé à</h1>
                                            <TextField id="outlined-basic" label="Raison sociale" variant="outlined" size='small' value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                            <TextField id="outlined-basic" label="Adresse" variant="outlined" size='small' value={address} onChange={e => setAddress(e.target.value)} />
                                            <TextField id="outlined-basic" label="Mail" variant="outlined" size='small' value={mailClient} onChange={e => setMailClient(e.target.value)} />
                                        </Stack>
                                        <div className='facture__infomation'>
                                            <span> {formattedInvoiceNumber}</span>
                                            <span>{formattedDate}</span>
                                        </div>
                                    </div>

                                </form>
                                <section className='product'>
                                    <div>
                                        {showAddProductModal && (
                                            <div className="modal" onClick={() => setShowAddProductModal(false)}>
                                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                    <div className='head__modal'>
                                                        <span>Ajout un Produit</span>
                                                        <span className="close-button" onClick={() => setShowAddProductModal(false)}>
                                                            &times;
                                                        </span>
                                                    </div>
                                                    <div className='body__modal'>
                                                        <form id="productForm" onSubmit={handleAddProduct} className='product__from'>
                                                            {headers.map((header) => (
                                                                <div key={header}>
                                                                    <input type="text" name={header.toLowerCase()} value={productValues[header.toLowerCase()] || ''} onChange={handleProductInputChange} placeholder={header} />
                                                                    {errorMessage && errorMessage.field === header.toLowerCase() && <div style={{ color: 'red' }}>{errorMessage.message}</div>}
                                                                </div>
                                                            ))}
                                                        </form>
                                                    </div>
                                                    <div className="footer__modal">

                                                        <button type="submit" form="productForm">VALIDER</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {showAddHeaderModal && (
                                            <div className="modal" onClick={() => setShowAddHeaderModal(false)}>
                                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                    <div className='head__modal'>
                                                        <span>Nouvel en-tête:</span>
                                                        <span className="close-button" onClick={() => setShowAddHeaderModal(false)}>
                                                            &times;
                                                        </span>
                                                    </div>
                                                    <div className='body__modal'>
                                                        <form onSubmit={handleAddHeader} id='addHeader'>
                                                            <label>
                                                                <input type="text" name="header" onChange={e => setNewHeader(e.target.value)} />
                                                            </label>

                                                        </form>

                                                    </div>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                {headers.map((header, index) => (
                                                                    <th key={index}>{header}</th>
                                                                ))}

                                                            </tr>
                                                        </thead>
                                                    </table>
                                                    <div className="footer__modal">
                                                        <button type="submit" form="addHeader">VALIDER</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {showAddClientModal && (
                                            <div className="modal" onClick={() => setShowAddClientModal(false)}>
                                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                    <div className='head__modal'>
                                                        <span>Nouveau Client</span>
                                                        <span className="close-button" onClick={() => setShowAddClientModal(false)}>
                                                            &times;
                                                        </span>
                                                    </div>
                                                    <div className='body__modal'>
                                                        <form onSubmit={handleAddClientFromModal} id='addClientModelForm'>
                                                            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder='Raison sociale' />
                                                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder='Adresse' />
                                                            <input type="text" value={mailClient} onChange={e => setMailClient(e.target.value)} placeholder='Mail' />

                                                        </form>

                                                    </div>
                                                    <div className="footer__modal">
                                                        <button type="submit" form="addClientModelForm">VALIDER</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {showEditProductModal && (
                                            <div className="modal" onClick={() => setShowEditProductModal(false)}>
                                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                                    <div className='head__modal'>
                                                        <span>Modifié votre produit</span>
                                                        <span className="close-button" onClick={() => setShowEditProductModal(false)}>
                                                            &times;
                                                        </span>
                                                    </div>
                                                    <div className='body__modal'>
                                                        <form onSubmit={handleUpdateProduct} id='editProduct'>
                                                            {Object.keys(updatedProduct || {}).map((property) => (
                                                                <input
                                                                    key={property}
                                                                    type="text"
                                                                    value={updatedProduct[property]}
                                                                    onChange={e => handleProductChange(e.target.value, property)}
                                                                    placeholder={property}
                                                                />
                                                            ))}
                                                        </form>
                                                    </div>
                                                    <div className="footer__modal">
                                                        <button type="submit" form="editProduct">Mettre a jour</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        {headers.map((header, index) => (
                                                            <TableCell key={index}>
                                                                <div className='name__header'>
                                                                    <span>{header}</span>
                                                                    {header !== 'tarifs' && (
                                                                        <span onClick={() => removeHeader(header)} className="close-button red">&times;</span>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        ))}
                                                        <TableCell>Action</TableCell> {/* Ajout d'une colonne d'action */}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products.map((product: never, index: number) => (
                                                        <TableRow key={index}>
                                                            {headers.map((header) => (
                                                                <TableCell key={header}>{product[header.toLowerCase()]}</TableCell>
                                                            ))}
                                                            <TableCell>
                                                                <button onClick={() => handleEditButtonClick(index)}>Edit</button>
                                                                <button onClick={() => handleRemoveProduct(index)}>Delete</button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>


                                </section>
                            </section>
                        </div>
                        <section className='footer'>
                            <div className='container__top'>

                                <div className='modalite'>
                                    <div>

                                        <div>
                                            <input type="number" value={maxDay} onChange={e => setMaxDay(e.target.value)} disabled={!showMaxDay} placeholder='Délai de règlement:' />
                                            <button onClick={() => setShowMaxDay(!showMaxDay)}>Activer/Désactiver</button>
                                        </div>
                                        <div>
                                            <input type="textarea perfectHight" value={textDelay} onChange={e => setTextDelay(e.target.value)} disabled={!showTextDelay} placeholder='En cas de retard de paiement :' />
                                            <button onClick={() => setShowTextDelay(!showTextDelay)}>Activer/Désactiver</button>
                                        </div>
                                    </div>

                                    <div className='buy__info'>
                                        <select value={paymentMethod} onChange={handlePaymentMethodChange} >
                                            <option value="">Sélectionnez une méthode de paiement</option>
                                            <option value="bankTransfer">Virement bancaire</option>
                                            <option value="paypal">PayPal</option>
                                        </select>

                                        {paymentMethod === 'bankTransfer' && (
                                            <input type="text" value={bankDetails} onChange={handleBankDetailsChange} placeholder="Entrez votre RIB" />
                                        )}
                                        {paymentMethod === 'paypal' && (
                                            <input type="text" value={paypalEmail} onChange={handlePaypalEmailChange} placeholder="Entrez votre adresse e-mail PayPal" />
                                        )}
                                    </div>
                                </div>
                                <Stack spacing={2}className='calcul'>
                                    <span>Total HT : {totalHTFormatted}</span>
                                    <div>
                                        <TextField type="number" id="outlined-basic" label={`Taux de TVA: ${tvaFormatted}`} variant="outlined" size='small' value={tvaRate} onChange={e => setTvaRate(Number(e.target.value))} />
                                    </div>
                                    <span>Total TTC : {totalTTCFormatted}</span>
                                    <span>Solde à payer : {totalTTCFormatted}</span>
                                </Stack>
                            </div>
                            <div className='author__info'>
                                <input type="text" value={siret} onChange={e => setSiret(e.target.value)} placeholder='SIRET' />
                                <input type="text" value={mailAuthor} onChange={e => setMailAuthor(e.target.value)} placeholder='Mail' />
                            </div>
                        </section>
                    </section>
                </div>
            </section>
        </section >
    );
};

export default InvoiceFormFormated;
