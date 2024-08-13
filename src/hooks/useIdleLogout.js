
import {useEffect,useRef} from 'react'

const useIdleLogout = (timeout = 600000) => {
    const timerRef = useRef(null);
    const resetTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            document.cookie = 'authenticate=;Max-Age=0;path=/';
        }, timeout);
    }
    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        });
        resetTimer()
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
    },[])
    return null
}
export default useIdleLogout;
