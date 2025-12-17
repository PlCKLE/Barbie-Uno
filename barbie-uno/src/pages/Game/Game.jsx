import { Card } from "../../components/Card"
const imageLink = "https://images.ctfassets.net/l7h59hfnlxjx/582Lx8AhvXHgRLXagk73lV/ef827f6b381202b112b61e218d8e3154/President_Obama_Headshot__Economic_Inclusion___Photo_by_Pari_Dukovic_courtesy_of_Penguin_Random_House_.jpg?q=75&w=1014&fm=webp"
export function Game() {
    return (
        <div>
            <Card value = {1} color = "blue" key = {1} cardIndex = {1} left = "20px" imageLink={imageLink} />
            <Card value = {1} color = "blue" key = {2} cardIndex = {2} left = "40px" imageLink={imageLink} />
            <Card value = {1} color = "blue" key = {3} cardIndex = {3} left = "60px" imageLink={imageLink} />
            <Card value = {1} color = "blue" key = {4} cardIndex = {4} left = "80px" imageLink={imageLink} />
            <Card value = {1} color = "blue" key = {5} cardIndex = {5} left = "100px" imageLink={imageLink} />
            <Card value = {1} color = "blue" key = {6} cardIndex = {6} left = "120px" imageLink={imageLink}/>
            <Card value = {1} color = "blue" key = {7} cardIndex = {7} left = "140px" imageLink={imageLink}/>
        </div>
    )
}