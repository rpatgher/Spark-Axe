function formatToMoney(number){
    return number.toLocaleString('es-ES', { style: 'currency', currency: 'MXN' });
}

export default formatToMoney;