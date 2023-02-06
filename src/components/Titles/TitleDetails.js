import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./TitleDetails.css"

export const TitleDetails = () => {

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()
    const { titleId } = useParams()

    const [title, setTitle] = useState({})
    const [countries, setCountries] = useState([])
    const [watchlistTypes, setWatchlistTypes] = useState([])
    const [watchlistTitles, setWatchlistTitles] = useState([])
    const [favorite, setFavorite] = useState({
        watchlistId: 0
    })
    const [showButton, setShowButton] = useState(true)
    const [showSaveForm, setShowSaveForm] = useState(false)

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "692a3bc309msh31d29e11c582aa5p1aa1c6jsn45689d696937");
    myHeaders.append("X-RapidAPI-Host", "unogs-unogs-v1.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    const parser = new DOMParser();

    useEffect(
        () => {
            fetch(`https://unogs-unogs-v1.p.rapidapi.com/title/details?netflix_id=${titleId}`, requestOptions)
                .then(response => response.json())
                .then(data => setTitle(data))
        },
        []
    )

    useEffect(
        () => {
            fetch(`https://unogs-unogs-v1.p.rapidapi.com/title/countries?netflix_id=${titleId}`, requestOptions)
                .then(response => response.json())
                .then((data) => setCountries(data.results))
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
            fetch(`http://localhost:8088/favorites?_expand=watchlist&userId=${VPNetflixUserObject.id}`)
                .then(res => res.json())
                .then((data) => {
                    setWatchlistTitles(data)
                    data.map(
                        (listTitle) => {
                            if (listTitle.netflix_id === title.netflix_id) {
                                setShowButton(false)
                            }
                        }
                    )
                })
        },
        [title]
    )

    const clickSaveHandler = (event) => {
        event.preventDefault()

        const favoriteObjectToSendToAPI = {
            userId: VPNetflixUserObject.id,
            netflix_id: title.netflix_id,
            img: title.default_image,
            title: title.title,
            type: title.title_type,
            watchlistId: favorite.watchlistId
        }

        return fetch("http://localhost:8088/favorites", {
            method: "POST",
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
            <div className="detailsContainer">
                <article className="detailsCard">
                    <h2 className="detailsName">{parser.parseFromString('<!doctype html><body>' + title.title, 'text/html').body.textContent }</h2>
                    <img
                        src={
                            title.large_image
                                ?
                                title.large_image
                                :
                                title.default_image
                        }
                        className="detailsImage"
                        alt="detailsCardImage"
                    />
                    <ul className="detailsList">
                        <li className="detailsListItem">
                            Year: {title.year}
                        </li>
                        <li className="detailsListItem">
                            Rating: {title.maturity_label}
                        </li>
                    </ul>
                    <section className="detailsSynopsis">
                        {parser.parseFromString('<!doctype html><body>' + title.synopsis, 'text/html').body.textContent }
                    </section>
                    {
                        showButton
                            ?
                            <div className="buttonContainer">
                                <div className="showSaveForm">
                                    <button className="showFormButton"
                                        onClick={() => {
                                            if (!showSaveForm) {
                                                setShowSaveForm(true)
                                            } else {
                                                setShowSaveForm(false)
                                            }
                                        }
                                        }>Save to Watchlist</button>
                                </div>
                                {
                                    showSaveForm
                                        ?
                                        <div className="favoriteDropdown">
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
                                            <button className="saveFavoriteButton"
                                                onClick={(click) => clickSaveHandler(click)}>Confirm</button>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                            :
                            ""
                    }
                </article>
                {
                    countries !== null
                        ?
                        <article className="countriesCard">
                            <h3>Available in:</h3>
                            <ul className="contriesList">
                                {
                                    countries.map(
                                        (country) => {
                                            return <li
                                                key={country.country_code}>
                                                {country.country}
                                            </li>
                                        }
                                    )
                                }
                            </ul>
                        </article>
                        :
                        <article>
                            <h3 className="contriesUnavailable">This title is not currently available</h3>
                        </article>
                }
            </div>
        </>
    )
}