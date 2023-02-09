import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const UserForm = () => {

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()

    const [countries, setCountries] = useState([])
    const [user, setUser] = useState({
        name: "",
        userName: "",
        email: `${VPNetflixUserObject.email}`,
        isStaff: false,
        country: ""
    })

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "692a3bc309msh31d29e11c582aa5p1aa1c6jsn45689d696937");
    myHeaders.append("X-RapidAPI-Host", "unogsng.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    useEffect(
        () => {
            fetch("https://unogsng.p.rapidapi.com/countries", requestOptions)
                .then(response => response.json())
                .then(data => setCountries(data.results))
        },
        []
    )

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        return fetch(`http://localhost:8088/users/${VPNetflixUserObject.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then((res) => res.json())
            .then(() => {
                localStorage.removeItem("vpNetflix_user")
                navigate("/login", { replace: true })
            })
    }

    return (
        <form className="profile">
            <h2 className="profile__title">Edit User Profile</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        value={user.name}
                        onChange={
                            (evt) => {
                                const copy = { ...user }
                                copy.name = evt.target.value
                                setUser(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="userName">Username:</label>
                    <input type="text"
                        className="form-control"
                        value={user.userName}
                        onChange={
                            (evt) => {
                                const copy = { ...user }
                                copy.userName = evt.target.value
                                setUser(copy)
                            }
                        } />
                </div>
            </fieldset>
            <fieldset>
                    <select className="userCountry"
                        onChange={(event) => {
                            const copy = { ...user }
                            copy.country = event.target.value
                            setUser(copy)
                        }}>
                        <option value={0}>Select Home Country</option>
                        {
                            countries.map(
                                (country) => {
                                    return <option key={country.id} value={country.countrycode}>{country.country}</option>
                                }
                            )
                        }
                    </select>
                </fieldset>
            <button
                onClick={(click) => handleSaveButtonClick(click)}
                className="btn btn-primary">
                Save Profile
            </button>
        </form>
    )
}