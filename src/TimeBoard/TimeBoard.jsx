import React from "react";
import { useEffect, useRef, useState } from "react";
import { Layout } from 'antd'
import { CalendarOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import Status from './Status'
import Info from './Info'
import TimeHead from "./TimeHead";
import system2region from './system2region.json'
import('./index.css')

let { Header, Content, Footer } = Layout

let headArr = [
    {
        keys: "event.event_type",
        th: "Type"
    },
    {
        keys: "solar_system_name",
        th: "System"
    },
    {
        keys: "event.solar_system_id",
        th: "Region"
    },
    {
        keys: "alliance.name",
        th: "Owner"
    },
    {
        keys: "event.start_time",
        th: "Time"
    },
    {
        keys: "event.start_time",
        th: "Remaining"
    },
    {
        keys: "event.defender_score",
        th: "DefenderScore"
    },
]

export default function TimeBoard() {
    const ws = useRef(null);
    const [message, setMessage] = useState('');
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
            setMessage(eval("(" + e.data + ")"));
        };
        return () => {
            ws.current?.close();
        };
    }, [ws]);
    if (message) {
        let [key1, key2] = key.split('.')
        message.initial.sort(compare(key1, key2, Reverse))
    }
    /**
     * 选择表头参数
     * @param {*} key 键
     * @param {*} select 当前排序项
     */
    function setPA(key, select) {
        // 若当前选择的排序字段改变 则默认正序
        if (temp != select) {
            setReverse(false)
        } else {
            // 否则将当前字段倒序排列
            setReverse(!Reverse)
        }
        setTemp(select)
        setKey(key)
        setSelect(select)
    }
    return (
        <Layout className="container" >
            <Header>
                <CalendarOutlined style={{ fontSize: "30px", color: "white" }} />
                <span style={{ color: "white", fontSize: "25px" }}>TimeBoard</span>
            </Header>
            <Content>
                <div style={{ textAlign: "center", minHeight: "120px" }}>
                    <Status data={typeArr} />
                </div>
                <div id="table">
                    <table>
                        <thead>
                            <tr>
                                {
                                    headArr.map(el => <TimeHead key={el.th} setPA={setPA} select={select} Reverse={Reverse} keys={el.keys} th={el.th} />)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !message ? <tr><td>loading</td></tr> : <Info data={message.initial} />
                            }
                        </tbody>
                    </table>
                </div>
            </Content>
            {/* <Footer>Footer</Footer> */}
        </Layout>
    )
}
/**
 * 对象排序函数
 * 按照 obj.[key1].[key2]进行比较
 * @param {*} key1 第一级key
 * @param {*} key2 第二级key
 * @param {*} Reverse 控制倒序
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

function filters(typeArr = [], arr = []) {
    if (typeArr.includes("UNCONTESTED")) {
        arr = arr.filter(el => new Date(el.event.start_time) < new Date())
    }
    if (typeArr.includes("ACTIVE")) {
        arr = arr.filter(el => new Date(el.event.start_time) < new Date())
    }
    if (typeArr.includes("UPCOMING")) {
        arr = arr.filter(el => new Date(el.event.start_time) > new Date())
    }
    if (typeArr.includes("UPCOMING")) {
        arr = arr.filter(el => new Date(el.event.start_time) - new Date() > 1000 * 60 * 60 * 4)
    }
    return arr
}