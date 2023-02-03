import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    return (
        <ul className="navbar">
            {
                localStorage.getItem("vpNetflix_user")
                    ? <li className="navbar__item navbar__logo">
                        <Link className="navbar__link" to="" onClick={() => {
                        }}>VPNetflix</Link>
                    </li>
                    : ""
            }
            {
                localStorage.getItem("vpNetflix_user")
                    ? <li className="navbar__item navbar__watchlist">
                        <Link className="navbar__link" to="/watchlist" onClick={() => {
                        }}>Watchlist</Link>
                    </li>
                    : ""
            }
            {
                localStorage.getItem("vpNetflix_user")
                    ? <li className="navbar__item navbar__profile">
                        <Link className="navbar__link" to="/profile" onClick={() => {
                        }}>{VPNetflixUserObject.userName}</Link>
                    </li>
                    : ""
            }
            {
                localStorage.getItem("vpNetflix_user")
                    ? <li className="navbar__item navbar__logout">
                        <Link className="navbar__link" to="" onClick={() => {
                            localStorage.removeItem("vpNetflix_user")
                            navigate("/", { replace: true })
                        }}>Logout</Link>
                    </li>
                    : ""
            }
        </ul>
    )
}

