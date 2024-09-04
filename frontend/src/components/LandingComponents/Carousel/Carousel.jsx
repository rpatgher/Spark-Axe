import React, { useEffect, useRef } from 'react';
import styles from './Carousel.module.css';
import Rat1 from './Rat1.jpg';
import Rat2 from './Rat2.jpg';
import Rat3 from './Rat3.jpg';
import Rat4 from './Rat4.jpg';
import Rat5 from './Rat5.jpg';
import Rat6 from './Rat6.jpg';
import Rat7 from './Rat7.jpg';

const Carousel = () => {
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        const startScrolling = () => {
            intervalRef.current = setInterval(() => {
                if (carousel) {
                    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                        carousel.scrollLeft = 0;
                    } else {
                        carousel.scrollLeft += 1;
                    }
                }
            }, 10);
        };

        const stopScrolling = () => {
            clearInterval(intervalRef.current);
        };

        startScrolling();

        carousel.addEventListener('mouseover', stopScrolling);
        carousel.addEventListener('mouseout', startScrolling);

        return () => {
            stopScrolling();
            carousel.removeEventListener('mouseover', stopScrolling);
            carousel.removeEventListener('mouseout', startScrolling);
        };
    }, []);

    const images = [Rat1, Rat2, Rat3, Rat4, Rat5, Rat6, Rat7];
    const links = [
        "https://example.com/rat1",
        "https://example.com/rat2",
        "https://example.com/rat3",
        "https://example.com/rat4",
        "https://example.com/rat5",
        "https://example.com/rat6",
        "https://example.com/rat7",
    ];

    return (
        <div className={styles.carousel}>
            <div className={styles.carouselItems} ref={carouselRef}>
                {images.concat(images).map((image, index) => (
                    <div className={styles.carouselItem} key={index}>
                        <img src={image} alt={`Rat ${index + 1}`} />
                        <button
                            className={styles.viewMoreButton}
                            onClick={() => window.location.href = links[index % links.length]}
                        >
                            Ver Más
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
