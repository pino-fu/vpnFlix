import { UserForm } from "./UserForm"
import { useState, useEffect } from "react"
import "./Profile.css"

export const Profile = () => {

  const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
  const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

  const [showForm, setShowForm] = useState(false)


  return (
    <>
      <div className="profileContainer">
        <div className="profileContainerContainer">
          <h2>User Profile</h2>
          <h3>Name: {VPNetflixUserObject.name}</h3>
          <h3>Username: {VPNetflixUserObject.userName}</h3>
          <h3>Email: {VPNetflixUserObject.email}</h3>
          <h3>Home Country: {VPNetflixUserObject.country}</h3>
          <button onClick={() => {
            if (!showForm) {
              setShowForm(true)
            } else {
              setShowForm(false)
            }
          }}>Edit Profile</button>
          {
            showForm
              ?
              <UserForm />
              :
              ""
          }
        </div>
      </div>
    </>
  )
}