import React from 'react';
import html2canvas from 'html2canvas';

const Support = () => {
    const takeScreenshot = () => {
        html2canvas(document.body).then(canvas => {
            const link = document.createElement('a');
            link.download = 'screenshot.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    return (
        <div>
            <button onClick={takeScreenshot}>Take Screenshot</button>
            <p>Hello</p>
        </div>
    );
}

export default Support;
