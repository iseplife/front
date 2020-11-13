import React, {useMemo} from "react"
import Loading from "../components/Common/Loading"

// https://www.makebullshit.com/
const RANDOM_SENTENCE: string[] = [
    "Chargement des vecteurs de temporisation",
    "Synergize frictionless technologies",
    "Génération du CA de JuniorISEP",
    "Leverage dynamic schemas",
    "Incubate value-added architectures",
    "Capture et écoute du réseau duplex",
    "Aggregate frictionless action-items",
    "Creation de la connection à l'API ISEP",
    "Incubate front-end relationships"
]
const LoadingPage: React.FC = () => {
    const sentence = useMemo(() => RANDOM_SENTENCE[Math.floor(Math.random() * RANDOM_SENTENCE.length)], [])

    return (
        <div className="h-screen w-screen fixed top-0 overflow-hidden">
            <Loading/>
        </div>
    )
}
export default LoadingPage