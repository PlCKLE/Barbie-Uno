import { Card } from "../../components/Card"
export function Game() {
    return (
        <div>
            <Card value = {1} color = "blue" key = {1} cardIndex = {1} />
            <Card value = {1} color = "blue" key = {2} cardIndex = {2} />
            <Card value = {1} color = "blue" key = {3} cardIndex = {3} />
            <Card value = {1} color = "blue" key = {4} cardIndex = {4} />
        </div>
    )
}