import React from "react";
import { useEffect, useRef, useState } from "react";
import { Layout } from 'antd'
import { CalendarOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import Status from './Status'
import Info from './Info'
import TimeHead from "./TimeHead";
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
    let [key, setKey] = useState("event.start_time")
    let [Reverse, setReverse] = useState(false)
    let [select, setSelect] = useState("Type")
    let [temp, setTemp] = useState("")
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
    function setPA(key, select) {
        if (temp != select) {
            setReverse(false)
        } else {
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
                    <Status
                        thiStatu={"UNCONTESTED"}
                    />
                    <Status
                        thiStatu={"ACTIVE"}
                    />
                    <Status
                        thiStatu={"UPCOMING"}
                    />
                    <Status
                        thiStatu={"START IN <4HRS"}
                    />
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

function compare(key1, key2, Reverse) {
    if (!key2) {
        return function (x, y) {
            if (x[key1] > y[key1]) {
                return 1 * (Reverse ? -1 : 1)
            } else if (x[key1] < y[key1]) {
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