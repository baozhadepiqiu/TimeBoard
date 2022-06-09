import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons'
import Style from './TimeBoard.module.css'
/**
 * @param {Function}  setPA 设置排序方法 将排序方式设置为当前键
 * @param {String}  select 当前的排序键 用于判定是否需要重新正序或者是当前排序方式反转
 * @param {String}  Reverse 正序 / 倒序
 * @param {String}  keys 键
 * @param {string}  th 表头名称
 * @returns 
 */
export default function TimeHead({ setPA, select, Reverse ,keys,th}) {
    return (
        <th onClick={() => setPA(keys, th)} className={Style.notBeSelect}>
            {th} {select === th ? (Reverse ? <SortDescendingOutlined /> : <SortAscendingOutlined />) : ""}
        </th>
    )
}