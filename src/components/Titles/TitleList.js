import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TitleList.css"

export const TitleList = () => {
    const [titles, setTitles] = useState([])
    const [selector, setSelector] = useState("0")

    const navigate = useNavigate()
    
    const queryLimit = 10

    const myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "692a3bc309msh31d29e11c582aa5p1aa1c6jsn45689d696937");
    myHeaders.append("X-RapidAPI-Host", "unogs-unogs-v1.p.rapidapi.com");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }

    useEffect(
        () => {
            fetch(`https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=${queryLimit}&order_by=rating_asc`, requestOptions)
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

                fetch(`https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=${queryLimit}&order_by=rating_asc`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        setTitles(data.results)
                    })

            } else if (selector === "1") {
                console.log("Viewing Movies")

                fetch(`https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=${queryLimit}&type=movie&order_by=rating_asc`, requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                        setTitles(data.results)
                    })

            } else if (selector === "2") {
                console.log("Viewing Series")

                fetch(`https://unogs-unogs-v1.p.rapidapi.com/search/titles?limit=${queryLimit}&type=series&order_by=rating_asc`, requestOptions)
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
                                        key={title.netflix_id}
                                        id={title.netflix_id}
                                        onClick={() => navigate(`details/${title.netflix_id}`)}
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

