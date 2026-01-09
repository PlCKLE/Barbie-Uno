import { useState } from 'react'

export function Socket() {

    const [gameCode, setGameCode] = useState()
    const [URL, setURL] = useState()
    const [args, setArgs] = useState([])
    const [identification, setIdentifitcaiton] = useState()


    return (
        <div>
            <input placeholder="gameCode" value={gameCode} onChange={changeGameCode}/>
            <input placeholder="URL" value={URL} onChange={changeURL}/>
            <input placeholder="args" value={args} onChange={changeArgs}/>
            <input placeholder="Identification" value={identification} onChange={changeIdentification}/>
        </div>
    )
}