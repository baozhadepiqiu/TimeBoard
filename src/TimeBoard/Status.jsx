import Style from './TimeBoard.module.css'

export default function Status({ onclick, checked, counts }) {
    let map = {
        UNCONTESTED: "未进行争夺",
        ACTIVE: "争夺中",
        UPCOMING: "近期全部",
        FourHour: "最近4小时内"
    }
    return (
        <>
            {
                ["UNCONTESTED", "ACTIVE", "UPCOMING", "FourHour"].map((el, index) =>
                    <div
                        key={el}
                        onClick={() => onclick(el)}
                        className={Style.statuTitle + ` ${checked.includes(el) ? Style.checked : Style.noChecked} ${Style.notBeSelect} ${el}`}>
                        {map[el]}
                        <div>{counts[index]}</div>
                    </div>)
            }
        </>
    )
}
