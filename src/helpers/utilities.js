export const parseMoney = (number,format) => {
    const money = !number || isNaN(number) ? 0 : parseFloat(number);
    return money.toLocaleString(format === 'USD' ? 'en-US' : 'es-PE',{
        style: 'currency',
        currency: format,
    });
}