import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { VPNetflix } from "./components/VPNetflix"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
    <BrowserRouter>
        <VPNetflix/>
    </BrowserRouter>
)

