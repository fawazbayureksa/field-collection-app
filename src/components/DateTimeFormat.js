export default function convertDate(datetime) {
    let registerDate = new Date(datetime);

    let MM = registerDate.toLocaleString('default', {
        month: 'long',
    }); // long, short
    let dd = registerDate.toLocaleString('default', {
        day: '2-digit'
    });
    let yyyy = registerDate.getFullYear();

    return `${dd} ${MM} ${yyyy}` || '-';
}

export function convertDate2(datetime) {
    let registerDate = new Date(datetime);

    let MM = registerDate.toLocaleString('default', {
        month: '2-digit',
    }); // long, short
    let dd = registerDate.toLocaleString('default', {
        day: '2-digit'
    });
    let yyyy = registerDate.getFullYear();

    return `${dd} ${MM} ${yyyy}` || '-';
}
