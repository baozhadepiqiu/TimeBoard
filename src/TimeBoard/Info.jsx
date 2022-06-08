import { useState, useRef, useEffect } from "react"
import system2region from './system2region.json'

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
export default function Info({ data }) {
    let [date, setDate] = useState(new Date())
    useInterval(() => {
        setDate(new Date())
    }, 1000)
    return (
        <>
            {
                data.map((el, index) => (
                    <tr key={"row" + index} >
                        <td>{el.event.event_type.split("_")[0]}</td>
                        <td>{el.solar_system_name}</td>
                        <td>{system2region[el.solar_system_name]}</td>
                        <td>{el.alliance.name}</td>
                        <td>{el.event.start_time}</td>
                        <td className={new Date(el.event.start_time) < date ? "RED" : "WHITE"}>
                            {
                                getDuration(new Date(el.event.start_time) - date)
                            }
                        </td>
                        <td>{el.event.defender_score * 100 + '%'}</td>
                    </tr>))
            }
        </>
    )
}

function getDuration(ms) {
    const days = parseInt(ms / (1000 * 60 * 60 * 24))
    ms %= (1000 * 60 * 60 * 24)
    const hour = parseInt(ms / (1000 * 60 * 60))
    // 防止出现 -1小时 -1分钟 -1秒这样的情况
    if (ms < 0) {
        ms *= -1
    }
    ms %= (1000 * 60 * 60)
    const min = parseInt(ms / (1000 * 60))
    ms %= (1000 * 60)
    const sec = parseInt(ms / (1000))
    return `${days > 0 ? days + "天 " : ""}` + `${fillZero(hour)}小时 ${fillZero(min)}分钟 ${fillZero(sec)}秒`
}
function fillZero(num) {
    return num < 10 && num > 0 ? `0${num}` : num
}