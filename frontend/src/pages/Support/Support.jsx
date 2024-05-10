const Support = () => {
    const shareToWhatsApp = (message) => {
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const dataArray = ["Item 1", "Item 2", "Item 3"]; // Your array

    const shareArrayToWhatsApp = () => {
        const message = dataArray.join('\n'); // Join array elements with new lines
        shareToWhatsApp(message);
    };

    return(
        <div>
            <button onClick={shareArrayToWhatsApp}>Print</button>
            <p>Hello</p>
        </div>
    );
}

export default Support;
