import React, { useState, useEffect } from 'react';
import './VapeCard.css';

const VapeCard = ({ vape }) => {
    const { name, price, image, color, initialImage } = vape;
    const [viewImage, setViewImage] = useState('');

    useEffect(() => {
        if(image){
            setViewImage(URL.createObjectURL(image));
        }
    }, [image]);
    

    return (
        <div className="card" style={{ backgroundColor: `color-mix(in srgb, ${color} 40%, #fff)` }}>
            <div className="vape">
                <div className="image">
                    {image ?
                        <img src={viewImage} alt={`${name} Vape Image`} />
                        :
                        <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/elements/${initialImage}`} alt={`${name} Vape Image`} />
                    }
                </div>
                <p className="descripcion">{name} </p>
            </div>
            <div className="price">
                <p style={{ backgroundColor: color }}>${price}</p>
            </div>
        </div>
    );
};

export default VapeCard;

