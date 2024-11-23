const Helper = {};

Helper.roundTo = (number, decimal) => {
    const d = Math.pow(10, decimal);
    return Math.round(number * d) / d;
}

Helper.getFullDate = (date) => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
}

Helper.apiTsToTableFormat = (ts) => {
    if (!ts) return ['', 'N/A'];
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const d = new Date(ts.replace('Z', '+08:00'));
    const formattedDate = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    const formattedTime = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
    return [formattedDate, formattedTime];
}

Helper.toHeaderTitleCase = (str) => {
    if (typeof str == 'string') {
        const ss = str.replace(/[$&+,:;=?@#|'<>.^*()%!-_]\s*/g, " ")
        return ss.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

}

Helper.toTitleCase = (str) => {
    //console.log(typeof str + " : " + str)
    if (typeof str == 'string') {
        const unquotaStr = str.replace(/['"]+/g, '')
        return unquotaStr.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
    //const ss = str.replace(/[$&+,:;=?@#|'<>.^*()%!-_]\s*/g, " ")
    return str;
}

Helper.toTitleCase2 = (str) => {
    //console.log(typeof str + " : " + str)
    if (typeof str == 'string') {
        const unquotaStr = str.replace(/['"]+/g, '')
        return unquotaStr.replace(
            /\w\S*/g,
            function (txt, index) {
                if (index === 0) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                } else {
                    return txt
                }

            }
        );
    }
    //const ss = str.replace(/[$&+,:;=?@#|'<>.^*()%!-_]\s*/g, " ")
    return str;
}

Helper.sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

Helper.addThousandSeparator = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

Helper.extractTelCountryCode = (tel) => {
    tel = tel.replace(/ /g, '');
    if (!tel || tel.length === 0) return ['', ''];
    const codeList1 = [
        '+1', '+7'
    ];
    const codeList2 = [
        '+20', '+27', '+28',
        '+30', '+31', '+32', '+33', '+34', '+36', '+37', '+38', '+39',
        '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49',
        '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58',
        '+60', '+61', '+62', '+463', '+64', '+65', '+66',
        '+81', '+82', '+84', '+86',
        '+90', '+91', '+92', '+93', '+94', '+95', '+98'
    ];

    if (tel.charAt(0) !== '+') {
        return ['', tel];
    } else if (codeList1.includes(tel.substring(0, 2))) {
        return [tel.substring(0, 2), tel.substring(2, tel.length)];
    } else if (codeList2.includes(tel.substring(0, 3))) {
        return [tel.substring(0, 3), tel.substring(3, tel.length)];
    } else {
        if (tel.length <= 3)
            return [tel, ''];
        else
            return [tel.substring(0, 4), tel.substring(4, tel.length)];
    }
}

Helper.operatorToString = (opr) => {
    switch (opr) {
        case "==":
            return "=";
        case "===":
            return "=";
        case "!=":
            return "≠";
        case "!==":
            return "≠";
        case ">=":
            return "≥";
        case "<=":
            return "≤";
        case "*":
            return "×";
        case "/":
            return "÷";
        default:
            return opr;
    }
}

export default Helper;