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
    myHeaders.append("X-RapidAPI-Host", "unogsng.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const parser = new DOMParser();

    useEffect(
        () => {
            fetch(`https://unogsng.p.rapidapi.com/title?netflixid=${titleId}`, requestOptions)
                .then(response => response.json())
                .then(data => setTitle(data.results[0]))
        },
        []
    )

    useEffect(
        () => {
            fetch(`https://unogsng.p.rapidapi.com/titlecountries?netflixid=${titleId}`, requestOptions)
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
                            if (listTitle.netflixid === title.netflixid) {
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
            netflixid: title.netflixid,
            img: title.img,
            title: title.title,
            type: title.vtype,
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
                    <h2 className="detailsName">{parser.parseFromString('<!doctype html><body>' + title.title, 'text/html').body.textContent}</h2>
                    <img
                        src={
                            title.lgimg
                                ?
                                title.lgimg
                                :
                                title.img
                        }
                        className="detailsImage"
                        alt="detailsCardImage"
                    />
                    <ul className="detailsList">
                        <li className="detailsListItem">
                            IMDb Rating: {title.imdbrating}
                        </li>
                        <li className="detailsListItem">
                            Video Type: {title.vtype}
                        </li>
                        <li className="detailsListItem">
                            Genre: {title.imdbgenre}
                        </li>
                        <li className="detailsListItem">
                            Rating: {title.matlabel}
                        </li>
                        <li className="detailsListItem">
                            Year: {title.year}
                        </li>
                        {
                            title.imdbruntime !== "0"
                                ?
                                <li className="detailsListItem">
                                    Length: {title.imdbruntime}
                                </li>
                                :
                                ""
                        }
                    </ul>
                    <section className="detailsSynopsis">
                        {parser.parseFromString('<!doctype html><body>' + title.synopsis, 'text/html').body.textContent}
                    </section>
                    <button className="netflixButton"
                        onClick={() => {
                            window.open(`https://www.netflix.com/title/${title.netflixid}`)
                        }}>View on Netflix</button>
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
                                                key={country.cc}>
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