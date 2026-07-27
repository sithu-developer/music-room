export const formatMusicTime = ( totalSec : number ) => {
    const min = Math.floor(totalSec/60);
    const sec = Math.floor(totalSec%60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}