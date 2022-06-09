import React from "react";
import { useEffect, useRef, useState } from "react";
import { Layout } from 'antd'
import { CalendarOutlined,LoadingOutlined } from '@ant-design/icons'
import Status from './Status'
import Info from './Info'
import TimeHead from "./TimeHead";
import system2region from './system2region.json'
import jsonpatch from 'jsonpatch'
import('./index.css')
import Style from './TimeBoard.module.css'

let { Header, Content, Footer } = Layout

let headArr = [
    {
        keys: "event.event_type",
        th: "Type",
        CN: "建筑类型"
    },
    {
        keys: "solar_system_name",
        th: "System",
        CN: "星系"
    },
    {
        keys: "event.solar_system_id",
        th: "Region",
        CN: "星域"
    },
    {
        keys: "alliance.name",
        th: "Owner",
        CN: "防守方"
    },
    {
        keys: "event.start_time",
        th: "Time",
        CN: "开始时间"
    },
    {
        keys: "event.start_time",
        th: "Remaining",
        CN: "剩余时间"
    },
    {
        keys: "event.defender_score",
        th: "DefenderScore",
        CN: "防守进度"
    },
]
let gTemp = {}

export default function TimeBoard() {
    const ws = useRef(null);
    let [message, setMessage] = useState('');
    // 排序字段
    let [key, setKey] = useState("event.start_time")
    // 排列顺序是否位倒序
    let [Reverse, setReverse] = useState(false)
    // 排列的字段  默认Type
    let [select, setSelect] = useState("Type")
    // 当前排序字段
    let [temp, setTemp] = useState("")
    let [typeArr, setTypeArr] = useState([])
    useEffect(() => {
        ws.current = new WebSocket("wss://timerboard.net/stream");
        ws.current.onmessage = e => {
            let datas = JSON.parse(e["data"])
            if ("initial" in datas) {
                setMessage(datas.initial);
                gTemp = datas.initial
            }
            if ("diff" in datas) {
                setMessage(jsonpatch.apply_patch(gTemp, datas["diff"]));
            }
            // 部分修改算法
        };
        return () => {
            ws.current?.close();
        };
    }, []);
    // 数据过滤
    if (message) {
        let [key1, key2] = key.split('.')
        let memo = message.sort(compare(key1, key2, Reverse))
        if (typeArr.includes("UNCONTESTED")) {
            message = message.filter(el => new Date(el.event.start_time) < new Date() && el.event.defender_score == 0.6)
        }
        if (typeArr.includes("ACTIVE")) {
            message = message.filter(el => new Date(el.event.start_time) < new Date())
        }
        if (typeArr.includes("UPCOMING")) {
            message = message.filter(el => new Date(el.event.start_time) > new Date())
        }
        if (typeArr.includes("FourHour")) {
            message = message.filter(el => {
                let time = new Date(el.event.start_time) - new Date()
                return time < 1000 * 60 * 60 * 4 && time > 0
            })
        }
        memo = null
    }
    /**
     *  选择表头参数
     * @param {String} key 键
     * @param {String} select 当前排序项
     */
    function setPA(key, select) {
        // 若当前选择的排序字段改变 则默认正序
        if (temp != select) {
            setReverse(false)
        } else {
            // 否则将当前字段排列顺序取反
            setReverse(!Reverse)
        }
        setTemp(select)
        setKey(key)
        setSelect(select)
    }
    function checkStatus(status) {
        let temp = Array.from(typeArr)
        if (temp.includes(status)) {
            temp = temp.filter(el => el !== status)
        } else {
            temp.push(status)
        }
        setTypeArr(temp)
    }
    return (
        <Layout className="container" >
            <Header>
                <CalendarOutlined style={{ fontSize: "30px", color: "white" }} />
                <span style={{ color: "white", fontSize: "25px" }}>TimeBoard</span>
            </Header>
            <hr />
            <Content>
                <div style={{ textAlign: "center", minHeight: "120px" }}>
                    <Status
                        data={typeArr}
                        checked={typeArr}
                        onclick={checkStatus}
                    />
                </div>
                <div id="table">
                    <table>
                        <thead>
                            <tr>
                                {
                                    headArr.map(el => <TimeHead
                                        key={el.th}
                                        setPA={setPA}
                                        select={select}
                                        Reverse={Reverse}
                                        keys={el.keys}
                                        th={el.th}
                                        cn={el.CN}
                                    />)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !message ? <tr><td colSpan="7" className={Style.loading}>loading <LoadingOutlined /> </td></tr> : <Info data={message} />
                            }
                        </tbody>
                    </table>
                </div>
            </Content>
            <hr />
            <Footer className={Style.footer}>
                <p className={Style.footerMessage}>{message.length} timers currently running.</p>
                <p>This App Power By <a href="https://react.docschina.org/" target="_blank">React</a> .
                    fed by data from <a href="https://github.com/xxpizzaxx/pizza-sov-relay" target="_blank">pizza-sov-relay</a> .
                    </p>
            </Footer>
        </Layout>
    )
}
/**
 * 对象排序函数
 * 按照 obj.[key1].[key2]进行比较
 * @param {String} key1 第一级key
 * @param {String} key2 第二级key
 * @param {boolean} Reverse 控制倒序
 * @returns sort()方法 的回调函数
 */
function compare(key1, key2, Reverse) {
    if (!key2) {
        // 注意 这里的 有个小小的问题 未能按正确的名称进行排列
        return function (x, y) {
            if (system2region[x.solar_system_name] > system2region[y.solar_system_name]) {
                return 1 * (Reverse ? -1 : 1)
            } else if (system2region[x.solar_system_name] < system2region[y.solar_system_name]) {
                return -1 * (Reverse ? -1 : 1)
            } else {
                return 0
            }
        }
    } else {
        return function (x, y) {
            if (x[key1][key2] > y[key1][key2]) {
                return 1 * (Reverse ? -1 : 1)
            } else if (x[key1][key2] < y[key1][key2]) {
                return -1 * (Reverse ? -1 : 1)
            } else {
                return 0
            }
        }
    }
}