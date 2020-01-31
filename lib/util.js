
const mapByte = (byte) => {
    switch (byte) {
            case 6  :
                return 'ACK';
            case 16 :
                return 'OUT OF PAPER';
            case 17 :
                return 'X-ON';
            case 19 :
                return 'X-OFF';
            case 24 :
                return 'PAPER JAM';
            case 25 :
                return 'ILLEGAL DATA';

        }

        return byte;
}

module.exports = {
    mapByte,
}