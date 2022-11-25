export default function getTypeFile(file) {
    const typeArr = file.name.split('.');
    const type = typeArr[typeArr.length - 1];

    switch (type) {
        case 'jpg':
        case 'jpeg':
            return 'jpg';
        case 'png':
            return 'png';
        case 'pdf':
            return 'pdf';
        case 'doc':
        case 'odt':
            return 'doc';
        case 'docx':
            return 'docx';
        case 'txt':
            return 'txt';
        case 'xls':
        case 'xps':
            return 'xls';
        case 'xlsx':
            return 'xlsx';
        case 'pps':
        case 'ppt':
        case 'ppsx':
        case 'pptx':
            return 'ppt';
        case 'zip':
            return 'zip';
        case 'rar':
            return 'rar';
        case 'psd':
            return 'psd';
        case 'cdw':
            return 'cdw';
        default:
            return '';
    }
}