import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

export const Register = (props) => {

    const [countries, setCountries] = useState([])
    const [user, setUser] = useState({
        email: "",
        name: "",
        userName: "",
        country: "",
        isStaff: false
    })
    let navigate = useNavigate()

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

    const registerNewUser = () => {
        return fetch("http://localhost:8088/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(createdUser => {
                if (createdUser.hasOwnProperty("id")) {
                    localStorage.setItem("vpNetflix_user", JSON.stringify({
                        id: createdUser.id,
                        staff: createdUser.isStaff,
                        email: createdUser.email,
                        name: createdUser.name,
                        userName: createdUser.userName,
                        country: createdUser.country
                    }))
                    navigate("/")
                }
            })
    }
    const handleRegister = (e) => {
        e.preventDefault()
        return fetch(`http://localhost:8088/users?email=${user.email}`)
            .then(res => res.json())
            .then(response => {
                if (response.length > 0) {
                    // Duplicate email. No good.
                    window.alert("Account with that email address already exists")
                }
                else {
                    // Good email, create user.
                    registerNewUser()
                }
            })
    }
    const updateCustomer = (evt) => {
        const copy = { ...user }
        copy[evt.target.id] = evt.target.value
        setUser(copy)
    }
    return (
        <main className="container--login" style={{ textAlign: "center" }}>
            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">create a <span>vpnFlix</span> account</h1>
                <fieldset>
                    <label htmlFor="email"> Email address </label>
                    <input onChange={updateCustomer}
                        type="email" id="email" className="form-control"
                        placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="name"> Full Name </label>
                    <input onChange={updateCustomer}
                        type="text" id="name" className="form-control"
                        placeholder="Enter your name" required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="userName"> Username </label>
                    <input onChange={updateCustomer}
                        type="userName" id="userName" className="form-control"
                        placeholder="Username" required />
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
                <fieldset>
                    <button type="submit"> Register </button>
                </fieldset>
            </form>
        </main>
    )
}

