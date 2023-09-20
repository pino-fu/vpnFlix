import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./TitleDetails.css";
import { NewtonsCradle } from "@uiball/loaders";

export const TitleDetails = () => {

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()
    const { titleId } = useParams()

    const [loading, setLoading] = useState(true)
    const [title, setTitle] = useState({})
    const [seasons, setSeasons] = useState([])
    const [seasonSelector, setSeasonSelector] = useState(1)
    const [seasonDisplay, setSeasonDisplay] = useState([])
    const [countries, setCountries] = useState([])
    const [watchlistTypes, setWatchlistTypes] = useState([])
    const [watchlistTitles, setWatchlistTitles] = useState([])
    const [favorite, setFavorite] = useState({
        watchlistId: 1
    })
    const [showButton, setShowButton] = useState(true)
    const [showSaveForm, setShowSaveForm] = useState(false)

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "814b065451msh799ec8d3ff2240ap1684a7jsnc2d335e70579");
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
                .then(() => setLoading(false))
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
            fetch(`https://unogsng.p.rapidapi.com/episodes?netflixid=${titleId}`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    setSeasons(data)
                    setSeasonDisplay(data[0].episodes)
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

    useEffect(
        () => {
            seasons.map(
                (season) => {
                    if (seasonSelector === season.season) {
                        setSeasonDisplay(season.episodes)
                    }
                }
            )
        },
        [seasonSelector]
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
            {
                loading
                    ?
                    <div className="loadingContainer">
                        <NewtonsCradle size={70} color="#119EC9" />
                    </div>
                    :
                    <div className="detailsContainer">
                        <article className="detailsCard">
                            <h1 className="detailsName">{parser.parseFromString('<!doctype html><body>' + title.title, 'text/html').body.textContent}</h1>
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
                                <div className="upperList">
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
                                </div>
                                <li className="detailsListItem" id="synopsisListItem">
                                    {parser.parseFromString('<!doctype html><body>' + title.synopsis, 'text/html').body.textContent}
                                </li>
                            </ul>
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
                            seasons.length !== 0
                                ?
                                <article className="seasonsContainer">
                                    {
                                        seasons.length > 1
                                            ?
                                            <h3 className="seasonCount">{seasons.length} Seasons Available</h3>
                                            :
                                            <h3 className="seasonCount">{seasons.length} Season Available</h3>
                                    }
                                    <select className="seasonSelector"
                                        onChange={(event) => {
                                            setSeasonSelector(parseInt(event.target.value))
                                        }}>
                                        {/* <option value={0}>Select to View Details</option> */}
                                        {
                                            seasons.map(
                                                (season) => {
                                                    return <option key={season.season} value={season.season}>Season {season.season}</option>
                                                }
                                            )
                                        }
                                    </select>
                                    <div className="seasonDisplay">
                                        {
                                            seasonDisplay.map(
                                                (episode) => {
                                                    return <section
                                                        className="episodeCard"
                                                        key={episode.epid}
                                                        id={episode.epid}>
                                                        <img
                                                            className="episodeCardImage"
                                                            alt="episodeCardImage"
                                                            src={episode.img}
                                                        />
                                                        <h5 className="episodeCardName">{episode.epnum}. {parser.parseFromString('<!doctype html><body>' + episode.title, 'text/html').body.textContent}</h5>
                                                    </section>
                                                }
                                            )
                                        }
                                    </div>
                                </article>
                                :
                                ""
                        }
                        {
                            countries !== null
                                ?
                                <article className="countriesCard">
                                    <h3>Streaming in:</h3>
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
                                    <h3 className="contriesUnavailable">This title is not currently streaming</h3>
                                </article>
                        }
                    </div>
            }
        </>
    )
}