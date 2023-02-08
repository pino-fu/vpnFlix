import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import "./Watchlist.css"

export const Watchlist = () => {

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()

    const [selector, setSelector] = useState("0")
    const [watchlistTitles, setWatchlistTitles] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [state, setState] = useState(false)
    const [watchlistTypes, setWatchlistTypes] = useState([])
    const [favorite, setFavorite] = useState({
        watchlistId: 0
    })


    useEffect(
        () => {
            fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}`)
                .then(res => res.json())
                .then((data) => {
                    setWatchlistTitles(data)
                })
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

    useEffect(
        () => {
            if (selector === "0") {
                console.log("Viewing All")

                fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}`)
                    .then(res => res.json())
                    .then((data) => {
                        setWatchlistTitles(data)
                    })

            } else if (selector === "1") {
                console.log("Viewing Movies")

                fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}&type=movie`)
                    .then(res => res.json())
                    .then((data) => {
                        setWatchlistTitles(data)
                    })

            } else if (selector === "2") {
                console.log("Viewing Series")

                fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}&type=series`)
                    .then(res => res.json())
                    .then((data) => {
                        setWatchlistTitles(data)
                    })
            }
        },
        [selector]
    )

    useEffect(
        () => {
            fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}`)
                .then(res => res.json())
                .then((data) => {
                    setWatchlistTitles(data)
                })
        },
        [state]
    )

    return (<>
        <article className="titleDropdown">
            <select onChange={(event) => setSelector(event.target.value)} id="titleType">
                <option className="option">Select a Filter</option>
                <option
                    value={0}>
                    All
                </option>
                <option
                    value={1}>
                    Movies
                </option>
                <option
                    value={2}>
                    Series
                </option>
            </select>
        </article>
        <div className="watchlistContainer">
            <article className="watchlistRow">
                <h2>VPN Needed</h2>
                {
                    watchlistTitles.map(
                        (title) => {
                            if (title.watchlist.id === 1) {
                                return <section className="titleCard"
                                    key={title.netflixid}
                                    id={title.netflixid}>
                                    <img
                                        src={title.img}
                                        className="titleImage"
                                        alt="titleCardImage"
                                        onClick={() => navigate(`../details/${title.netflixid}`)}
                                    />
                                    <div className="buttonPanel">
                                        <button className="deleteButton"
                                            onClick={() => {
                                                fetch(`http://localhost:8088/favorites/${title.id}`, {
                                                    method: "DELETE"
                                                })
                                                    .then(() => {
                                                        state
                                                            ?
                                                            setState(false)
                                                            :
                                                            setState(true)
                                                    })
                                            }}>Delete</button>
                                        <button className="editButton"
                                            onClick={() => navigate(`../edit/${title.netflixid}`)}
                                        >Edit</button>
                                    </div>
                                    <div className="editPanel">
                                        {
                                            showForm
                                                ?
                                                <select className="favoriteType"
                                                    onChange={(event) => {
                                                        const copy = { ...favorite }
                                                        copy.watchlistId = event.target.value
                                                        setFavorite(copy)
                                                    }}>
                                                    <option value={0}>Select a Watchlist</option>
                                                    {
                                                        watchlistTypes.map(
                                                            (type) => {
                                                                return <option key={type.id} value={type.id}>{type.name}</option>
                                                            }
                                                        )
                                                    }
                                                </select>
                                                :
                                                ""
                                        }
                                    </div>
                                </section>
                            }
                        }
                    )
                }
            </article>
            <article className="watchlistRow">
                <h2>No VPN Needed</h2>
                {
                    watchlistTitles.map(
                        (title) => {
                            if (title.watchlist.id === 2) {
                                return <section className="titleCard"
                                    key={title.netflixid}
                                    id={title.netflixid}>
                                    <img
                                        src={title.img}
                                        className="titleImage"
                                        alt="titleCardImage"
                                        onClick={() => navigate(`../details/${title.netflixid}`)}
                                    />
                                    <div className="buttonPanel">
                                        <button className="deleteButton"
                                            onClick={() => {
                                                fetch(`http://localhost:8088/favorites/${title.id}`, {
                                                    method: "DELETE"
                                                })
                                                    .then(() => {
                                                        state
                                                            ?
                                                            setState(false)
                                                            :
                                                            setState(true)
                                                    })
                                            }}>Delete</button>
                                        <button className="editButton"
                                            onClick={() => navigate(`../edit/${title.netflixid}`)}
                                        >Edit</button>
                                    </div>
                                    <div className="editPanel">
                                        {
                                            showForm
                                                ?
                                                <select className="favoriteType"
                                                    onChange={(event) => {
                                                        const copy = { ...favorite }
                                                        copy.watchlistId = event.target.value
                                                        setFavorite(copy)
                                                    }}>
                                                    <option value={0}>Select a Watchlist</option>
                                                    {
                                                        watchlistTypes.map(
                                                            (type) => {
                                                                return <option key={type.id} value={type.id}>{type.name}</option>
                                                            }
                                                        )
                                                    }
                                                </select>
                                                :
                                                ""
                                        }
                                    </div>
                                </section>

                            }
                        }
                    )
                }
            </article>
        </div>
    </>
    )
}