import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

const BillScanner = () => {
    const [image, setImage] = useState(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [dates, setDates] = useState([]);
    const [title, setTitle] = useState('');

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleTextRecognition = () => {
        setLoading(true);
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: (m) => console.log(m),
            }
        ).then(({ data: { text } }) => {
            setRecognizedText(text);
            parseText(text);
            setLoading(false);
        });
    };

    const parseText = (text) => {
        const lines = text.split('\n');
        const parsedItems = [];
        let tempTitle = '';
        let titleFound = false;
        let previousLine = '';

        const datePattern = /\b\d{1,2}[\/-]\d{1,2}[\/-](\d{2}|\d{4})\b/;
        const pricePattern = /\d{1,3}(,\d{3})*(\.\d{1,2})?$/;

        lines.forEach(line => {
            const matchDate = line.match(datePattern);
            if (matchDate) {
                const date = matchDate[0];
                setDates(prevDates => [...prevDates, date]);
            } else if (!titleFound && line.trim() !== '') {
                const trimmedLine = line.trim();
                tempTitle += trimmedLine + ' ';
                if (trimmedLine.includes(' ')) {
                    titleFound = true;
                    tempTitle = tempTitle.trim();
                }
            } else {
                const match = line.match(pricePattern);
                if (match) {
                    const price = match[0];
                    const cleanPrice = price.replace(/[,.]/g, ''); // Remove separators to check length
                    if (cleanPrice.length >= 4) {
                        const quantityPrice = line.split(' x ');
                        const quantity = quantityPrice.length > 1 ? parseFloat(quantityPrice[0].trim().replace(',', '.')) : undefined;
                        const itemPrice = quantityPrice.length > 1 ? quantityPrice[1].trim().split(' ').pop().replace(',', '.') : undefined;

                        parsedItems.push({
                            item: previousLine.trim(),
                            price,
                            quantity,
                            itemPrice
                        });
                    }
                }
                previousLine = line;
            }
        });

        setTitle(tempTitle);
        setItems(parsedItems);
    };

    useEffect(() => {
        console.log("Items:", items);
    }, [items]);

    return (
        <div className='row'>
            <div className={(image ? "col-6" : "col-12")}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {image && (
                    <div className='col-12 d-flex justify-content-center'>
                        <img src={image} alt="uploaded" style={{ width: '300px' }} />
                    </div>
                )}
            </div>

            {image && (
                <div className='col-6'>
                    <div>
                        <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={handleTextRecognition}
                            isLoading={loading}
                        >
                            {loading ? 'Recognizing...' : 'Recognize Text'}
                        </Button>
                    </div>
                    {title && (
                        <div>
                            <p className='fs-5'>Title: {title}</p>
                        </div>
                    )}
                    {items.length > 0 && (
                        <>
                            <p className='fs-5'>Recognized Items:</p>
                            <table className='table'>
                                <tbody>
                                    <tr>
                                        <td>Date</td>
                                        <td></td>
                                        <td></td>
                                        <td>{dates.join(', ')}</td>
                                    </tr>

                                    {items.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                (item.item.toLowerCase().includes('disc') ? 'table-info ' : ' ') +
                                                (item.item.toLowerCase().includes('total') ? 'table-success ' : ' ') +
                                                (index === items.length - 1 ? 'table-success' : ' ')
                                            }
                                        >
                                            <td> {item.quantity === undefined ? item.item : item.quantity}</td>
                                            <td> {item.quantity === undefined ? "" : "x"} </td>
                                            <td> {item.itemPrice} </td>
                                            <td>Rp {item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BillScanner;
