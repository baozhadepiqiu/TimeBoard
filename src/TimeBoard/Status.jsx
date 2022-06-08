export default function Status({ thiStatu, thisClick }) {
    return (
        <div onClick={thisClick} style={{display:"inline-block",margin:"0 10px 0 10px",bottom:"0"}}>
            {thiStatu}
        </div>
    )
}