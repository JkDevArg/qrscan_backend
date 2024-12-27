export class generateOrder {
    static generateOrderNumber(){
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');

        const orderNumber = `R${year}${month}${day}${hours}${minutes}`;

        return orderNumber;
    }
}