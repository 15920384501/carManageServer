

//处理时间格式
const dateFilter = (date) => {
    let time = new Date(date) ;
    let year = time.getFullYear() ;
    let month = time.getMonth()+1 ;
    let day = time.getDate();
    let hour = time.getHours();
    let min = time.getMinutes();
    let s = time.getSeconds();

    //少于10补0
    month = month < 10 ? '0'+month : month ;
    day = day < 10 ? '0'+day : day ;
    hour = hour < 10 ? '0'+hour : hour ;
    min = min < 10 ? '0'+min : min ;
    s = s < 10 ? '0'+s : s ;

    return `${year}-${month}-${day}  ${hour}:${min}:${s}` ;
}


export default {
    dateFilter
}
