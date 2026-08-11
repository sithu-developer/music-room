export const formatMusicTime = ( totalSec : number ) => {
    const min = Math.floor(totalSec/60);
    const sec = Math.floor(totalSec%60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}


export const formatChatTime = (time : Date) => {
    const date = new Date(time);

    return date.toLocaleTimeString([], {
        hour : "2-digit",
        minute : "2-digit",
        hour12 : false
    })
}