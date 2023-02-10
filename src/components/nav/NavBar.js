import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    return (
        <nav>
            <div className="navbar">
                <section className="logo" onClick={() => navigate("")}>vpnFlix</section>
                <div className="subnav">
                    <button className="subnavbtn">{VPNetflixUserObject.userName} <i className="fa fa-caret-down"></i></button>
                    <div className="subnav-content">
                        <section className="a_item"
                            onClick={(
                                () => {
                                    navigate("/watchlist")
                                }
                            )}>Watchlist</section>
                        <section className="a_item"
                            onClick={(
                                () => {
                                    navigate("/profile")
                                }
                            )}>Profile</section>
                        <section className="a_item"
                            onClick={(
                                () => {
                                    localStorage.removeItem("vpNetflix_user")
                                    navigate("/")
                                }
                            )}>Logout</section>
                    </div>
                </div>
            </div>
        </nav>
    )
}

