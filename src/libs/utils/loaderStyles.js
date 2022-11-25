export default function loaderStyles() {
    return {
        bg: {
            default: {
                backgroundColor: 'rgba(255,255,255,1)',
                position: 'fixed',
                fontFamily: 'Arial',
                fontSize: '16px',
                zIndex: 9999
            },
            btn_login: {
                backgroundColor: '#1ec772',
                position: 'absolute',
                fontFamily: 'Arial',
                fontSize: '16px',
                zIndex: 9999
            }
        },
        fg: {
            default: {
                color: '#333'
            },
            btn_login: {
                color: '#fff'
            }
        }
    };
}
