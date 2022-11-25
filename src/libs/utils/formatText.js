export default function formatText(text = '', type = '') {
    switch (type) {
        case 'number':
            return String(text)
                .replace(/\D/g, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        default:
            return text;
    }
}
