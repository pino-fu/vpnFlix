import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const UserForm = () => {

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()

    //const [showForm, setShowForm] = useState(false)

    const [user, setUser] = useState({
        name: "",
        userName: "",
        email: `${VPNetflixUserObject.email}`,
        isStaff: false
    })

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
            <button
                onClick={(click) => handleSaveButtonClick(click)}
                className="btn btn-primary">
                Save Profile
            </button>
        </form>
    )
}