import React, { useState } from "react"
import axios from "axios"
import Spinner from "./spinner"

function HomePage() {

    const [inputUrl, setInputUrl] = useState("")
    const [mediaDownloadUrl, setMediaDownloadUrl] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [isDownloadReady, setIsDownloadReady] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function handleInput(event) {
        setInputUrl(event.target.value)
        setIsDisabled(false)
    }

    function processInstagramUrl() {
        // Instagram logic
        setIsLoading(true)

        // Generate download url
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index',
            params: { url: inputUrl },
            headers: {
                'X-RapidAPI-Key': '97b71515femsh9d1af67bf30806dp18bdefjsn2095b481d04b',
                'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
            }
        }

        axios.request(options).then(function (response) {
            setMediaDownloadUrl(response.data.media)
            setIsDownloadReady(true)
            setIsLoading(false)
        }).catch(function (error) {
            console.error(error);
        })
    }

    function processFacebookUrl() {
        // Facebook logic
        setIsLoading(true)

        // Generate download url
        const options = {
            method: 'GET',
            url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
            params: { url: inputUrl },
            headers: {
                'X-RapidAPI-Key': '97b71515femsh9d1af67bf30806dp18bdefjsn2095b481d04b',
                'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
            }
        }

        axios.request(options).then(function (response) {
            setMediaDownloadUrl(response.data.links["Download High Quality"])
            setIsDownloadReady(true)
            setIsLoading(false)
        }).catch(function (error) {
            console.error(error);
        });
    }

    function processYoutubeUrl() {
        // Youtube logic
        setIsLoading(true)

        const options = {
            method: 'POST',
            url: 'http://localhost:3001/generate-youtube-video-download-url',
            data: {
                youtubeVideoUrl: inputUrl,
            }
        }

        axios(options).then((response) => {
            console.log(response.data)
            setMediaDownloadUrl(response.data.downloadUrl)
            setIsDownloadReady(true)
            setIsLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }

    function handleUrlProccessing() {
        if (inputUrl.includes("instagram")) {
            processInstagramUrl()
        } else if (inputUrl.includes("facebook")) {
            processFacebookUrl()
        } else if (inputUrl.includes("youtube")) {
            processYoutubeUrl()
        }

    }

    function handleDownload() {
        setIsLoading(true)

        // Download logic
        fetch(mediaDownloadUrl, {
            method: 'GET',
        })
            .then((response) => response.blob())
            .then((blob) => {
                setIsLoading(false)
                const url = window.URL.createObjectURL(new Blob([blob]))
                const link = document.createElement('a')
                link.href = url;
                link.setAttribute(
                    'download',
                    'downloadedFile.mp4'
                );
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)

                setIsDownloadReady(false)
                setIsDisabled(true)
                setInputUrl("")
            });
    }

    return (

        <>
            {isLoading && <Spinner />}
            <div className="container">
                <div className="col-md-12">
                    <div className="row video-options-row mt-md-5">
                        <div className="col-md-4">
                            <div className="card mt-4 mt-md-0">
                                <div className="card-body p-0">
                                    <div className="bg-light p-3">
                                        <h5>Video Downloader</h5>
                                    </div>

                                    {/* URL Input Section */}

                                    <div className="m-4">
                                        <strong>Enter Video Url</strong>
                                        <div className="border mt-2">
                                            <div className="form-group p-3">
                                                <div className="col-md-12">
                                                    <input type="text" className="form-control" onChange={handleInput} name="inputUrl" value={inputUrl} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        isDownloadReady ?
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={handleDownload}
                                            >
                                                Download Video
                                            </button>
                                            :
                                            <button
                                                className="btn btn-primary w-100"
                                                disabled={isDisabled}
                                                onClick={handleUrlProccessing}
                                            >
                                                Process Url
                                            </button>
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="video-frame-container">
                                {
                                    mediaDownloadUrl &&
                                    <video src={mediaDownloadUrl} poster="" className="w-100 h-100" controls ></video>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage