import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TitleList.css"

export const TitleList = () => {
    const [titles, setTitles] = useState([])
    const [selector, setSelector] = useState("0")

    const navigate = useNavigate()

    const queryLimit = 100

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

            fetch(`https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0&end_year=2023`, requestOptions)
                .then(response => response.json())
                .then((data) => {
                    setTitles(data.results)
                })
        },
        []
    )

    useEffect(
        () => {
            if (selector === "0") {
                console.log("Viewing All")

                fetch(`https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0&end_year=2023`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        setTitles(data.results)
                    })

            } else if (selector === "1") {
                console.log("Viewing Movies")

                fetch(`https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0&end_year=2023&type=movie`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        setTitles(data.results)
                    })

            } else if (selector === "2") {
                console.log("Viewing Series")

                fetch(`https://unogsng.p.rapidapi.com/search?start_year=1972&orderby=rating&limit=${queryLimit}&subtitle=english&audio=english&offset=0&end_year=2023&type=series`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        setTitles(data.results)
                    })
            }
        },
        [selector]
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
        <article className="titleCardContainer">
            {
                titles.map(
                    (title) => {
                        return <section className="titleCard"
                            key={title.nfid}
                            id={title.nfid}
                            onClick={() => navigate(`details/${title.nfid}`)}
                        >
                            <img
                                src={title.img}
                                className="titleImage"
                                alt="titleCardImage"
                            />
                        </section>
                    }
                )
            }
        </article>
    </>
    )
}

