export default function CurrencyFormat(price) {
    try {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    } catch (Exception) {
        return price
    }
}