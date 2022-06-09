import { useState, useRef, useEffect } from "react"
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import system2region from './system2region.json'
import Style from './TimeBoard.module.css'


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
/**
 * @param {Array} data 各个星系详情
 * @returns 
 */
export default function Info({ data }) {
    let [date, setDate] = useState(new Date())
    useInterval(() => {
        setDate(new Date())
    }, 1000)
    return (
        <>
            {
                data.map((el, index) => (
                    <tr key={"row" + index} className={Style.InfoHover} >
                        <td>{el.event.event_type.split("_")[0]}</td>
                        <td>
                            <a
                                className={Style.link}
                                target="_blank"
                                href={"http://evemaps.dotlan.net/search?q=" + el.solar_system_name}>
                                {el.solar_system_name}
                            </a>
                        </td>
                        <td>{system2region[el.solar_system_name]}</td>
                        <td>
                            <a
                                className={Style.link}
                                target="_blank"
                                href={"http://evemaps.dotlan.net/search?q=" + el.alliance.name}>
                                {el.alliance.name}
                            </a>
                        </td>
                        <td>{el.event.start_time}</td>
                        <td className={new Date(el.event.start_time) < date ? "RED" : "WHITE"}>
                            {
                                getDuration(new Date(el.event.start_time) - date)
                            }
                        </td>
                        <td>
                            {el.event.defender_score * 100 + '%'}
                            {new Date(el.event.start_time) < date ?
                                el.event.defender_score < 0.6 ? <ArrowDownOutlined title="the defender is lossing score" className={Style.redBlink + " " + Style.icon} />
                                    : <ArrowUpOutlined title="the defender is getting score" className={Style.greenBlink + " " + Style.icon} />
                                : ""}
                        </td>
                    </tr>))
            }
        </>
    )
}

function getDuration(ms) {
    let temp = ms
    if (ms < 0) ms *= -1
    const days = parseInt(ms / (1000 * 60 * 60 * 24))
    ms %= (1000 * 60 * 60 * 24)
    const hour = parseInt(ms / (1000 * 60 * 60))
    ms %= (1000 * 60 * 60)
    const min = parseInt(ms / (1000 * 60))
    ms %= (1000 * 60)
    const sec = parseInt(ms / (1000))
    return `${temp < 0 ? "-" : ""}${days > 0 ? days + "天 " : ""}` + `${fillZero(hour)}小时 ${fillZero(min)}分钟 ${fillZero(sec)}秒`
}
function fillZero(num) {
    return num < 10 && num > 0 ? `0${num}` : num
}