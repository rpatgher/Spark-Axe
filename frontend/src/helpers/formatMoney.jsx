function formatToMoney(number){
    return number.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

export default formatToMoney;