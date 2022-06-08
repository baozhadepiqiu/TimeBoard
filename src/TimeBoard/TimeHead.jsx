import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'

export default function TimeHead({ setPA, select, Reverse ,keys,th}) {
    return (
        <th onClick={() => setPA(keys, th)}>
            {th} {select === th ? (Reverse ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : ""}
        </th>
    )
}