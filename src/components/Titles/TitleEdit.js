import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const TitleEdit = () => {

    const navigate = useNavigate()
    const { titleId } = useParams()

    const [title, setTitle] = useState([{}])
    const [watchlistTypes, setWatchlistTypes] = useState([])
    const [favorite, setFavorite] = useState({
        watchlistId: 1
    })

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "814b065451msh799ec8d3ff2240ap1684a7jsnc2d335e70579");
    myHeaders.append("X-RapidAPI-Host", "unogs-unogs-v1.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    useEffect(
        () => {
            fetch(`http://localhost:8088/favorites?netflixid=${titleId}`, requestOptions)
                .then(response => response.json())
                .then(data => setTitle(data[0]))
        },
        []
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/watchlists`)
                .then(res => res.json())
                .then((data) => {
                    setWatchlistTypes(data)
                })
        },
        []
    )

    const clickSaveHandler = (event) => {
        event.preventDefault()

        const favoriteObjectToSendToAPI = {
            userId: title.userId,
            netflixid: title.netflixid,
            type: title.type,
            img: title.img,
            title: title.title,
            watchlistId: favorite.watchlistId
        }

        return fetch(`http://localhost:8088/favorites/${title.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(favoriteObjectToSendToAPI)
        })
            .then(res => res.json())
            .then(() => {
                navigate("/watchlist")
            })
    }

    return (
        <>
            <article className="detailsCard">
                <h2 className="detailsName">{title.title}</h2>
                <img
                    src={title.img}
                    className="detailsImage"
                    alt="detailsCardImage"
                />
                <div className="favoriteDropdown">
                    <select className="favoriteType"
                        onChange={(event) => {
                            const copy = { ...favorite }
                            copy.watchlistId = parseInt(event.target.value)
                            setFavorite(copy)
                        }}>
                        {
                            watchlistTypes.map(
                                (type) => {
                                    return <option key={type.id} value={type.id}>{type.name}</option>
                                }
                            )
                        }
                    </select>
                    <button className="saveFavoriteButton"
                        onClick={(click) => clickSaveHandler(click)}>☑️</button>
                </div>
                </article>
        </>
    )
}