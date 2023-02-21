import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TitleList.css"

export const TitleList = () => {
    const [titles, setTitles] = useState([])
    const [exclude, setExclude] = useState(0)
    const [searchTerms, setSearchTerms] = useState({
        query: "",
        type: "",
        queryLimit: 50
    })
    const [offset, setOffset] = useState(0)
    const [dependancyBoolean, setDependancyBoolean] = useState(false)

    const localVPNetflixUser = localStorage.getItem("vpNetflix_user")
    const VPNetflixUserObject = JSON.parse(localVPNetflixUser)

    const navigate = useNavigate()

    const parser = new DOMParser();

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

            fetch(`https://unogsng.p.rapidapi.com/search?orderby=rating&limit=${searchTerms.queryLimit}&subtitle=english&audio=english&offset=0`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    setTitles(data.results)
                })
        },
        []
    )

    useEffect(
        () => {

            setOffset(offset + searchTerms.queryLimit)

            fetch(`https://unogsng.p.rapidapi.com/search?orderby=rating&limit=${searchTerms.queryLimit}&subtitle=english&audio=english&offset=${offset}&type=${searchTerms.type}`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    const copy = [...titles]
                    data.results.map((result) => copy.push(result))
                    setTitles(copy)
                })
        },
        [dependancyBoolean]
    )

    useEffect(
        () => {

            titles.length === 0
                ?
                fetch(`https://unogsng.p.rapidapi.com/search?orderby=rating&limit=${searchTerms.queryLimit}&subtitle=english&audio=english&offset=${searchTerms.queryLimit}&query=${searchTerms.query}&type=${searchTerms.type}&countrylist=`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        if (exclude) {
                            const filtered = data.results.filter(title => !title.clist.includes(VPNetflixUserObject.country))
                            setTitles(filtered)
                        } else {
                            setTitles(data.results)
                        }
                    })
                    .then(() => setOffset(searchTerms.queryLimit))
                :
                fetch(`https://unogsng.p.rapidapi.com/search?orderby=rating&limit=${searchTerms.queryLimit}&subtitle=english&audio=english&offset=0&query=${searchTerms.query}&type=${searchTerms.type}&countrylist=`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        if (exclude) {
                            const filtered = data.results.filter(title => !title.clist.includes(VPNetflixUserObject.country))
                            setTitles(filtered)
                        } else {
                            setTitles(data.results)
                        }
                    })
                    .then(() => setOffset(searchTerms.queryLimit))
        },
        [searchTerms, exclude]
    )

    return (<>
        <div className="formContainer">
            <article className="searchInput">
                <input className="searchBar"
                    onChange={
                        (changeEvent) => {
                            const copy = { ...searchTerms }
                            copy.query = changeEvent.target.value
                            setSearchTerms(copy)
                        }
                    }
                    type="text" placeholder="Search the Globe" />
            </article>
            <article className="titleDropdown">
                <select onChange={
                    (changeEvent) => {
                        const copy = { ...searchTerms }
                        copy.queryLimit = parseInt(changeEvent.target.value)
                        setSearchTerms(copy)
                    }
                }
                    id="searchMode">
                    <option className="option" value={50}>Browse Mode</option>
                    <option className="option" value={10}>Search Mode</option>
                </select>
            </article>
            <article className="titleDropdown">
                <select onChange={(event) => {
                    const copy = { ...searchTerms }
                    copy.type = event.target.value
                    setSearchTerms(copy)
                }
                }
                    id="titleType">
                    <option className="option" value={""}>Show All</option>
                    <option className="option" value={"movie"}>Show Movies</option>
                    <option className="option" value={"series"}>Show Series</option>
                </select>
            </article>
            <article className="titleDropdown">
                <select onChange={(event) => {
                    setExclude(parseInt(event.target.value))
                }}
                    id="titleExclude">
                    <option className="option" value={0}>Include {VPNetflixUserObject.country}</option>
                    <option className="option" value={1}>Exclude {VPNetflixUserObject.country}</option>
                </select>
            </article>
            <article className="titleDropdown">
                <h4>Showing {titles.length} results</h4>
            </article>
        </div>
        <article className="titleCardContainer">
            {
                titles.map(
                    (title) => {
                        return <>
                            <section className="titleCard"
                                key={title.nfid}
                                id={title.nfid}
                                onClick={() => navigate(`details/${title.nfid}`)}>
                                <img
                                    src={title.img}
                                    className="titleImage"
                                    alt="titleCardImage" />
                                <div className="overlay"
                                    key={title.nfid}>
                                    <div className="overlayContent">
                                        <ul className="overlayItemContaier">
                                            {/* <li className="overlayItem">{parser.parseFromString('<!doctype html><body>' + title.title, 'text/html').body.textContent}</li> */}
                                            <li className="overlayItem">IMDb: {title.imdbrating}</li>
                                            <li className="overlayItem">Year: {title.year}</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </>
                    }
                )
            }
        </article>
        {
            searchTerms.queryLimit === 50 && exclude === 0 && searchTerms.query === ""
                ?
                <div className="showMoreButtonContainer">
                    <button className="showMoreButton"
                        onClick={() => {
                            !dependancyBoolean
                                ?
                                setDependancyBoolean(true)
                                :
                                setDependancyBoolean(false)
                        }}
                    >Show More</button>
                </div>
                :
                ""
        }
    </>
    )
}