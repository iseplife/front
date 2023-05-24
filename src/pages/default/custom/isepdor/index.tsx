import { debounce } from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { getCurrentSession, getQuestions, voteIORQuestion } from "../../../../data/custom/isepdor"
import { IORQuestionType, IORSession, IORVotedQuestion } from "../../../../data/custom/isepdor/types"
import { searchClub, searchEvent, searchStudent } from "../../../../data/searchbar"
import ErrorInterface from "../../../errors/ErrorInterface"
import LoadingPage from "../../../LoadingPage"
import Axios, {CancelTokenSource} from "axios"
import { handleRequestCancellation } from "../../../../util"
import { SearchItem, SearchItemType } from "../../../../data/searchbar/types"
import SearchItemComponent from "./SearchItem"

const IsepDor: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState<IORVotedQuestion[]>([])
    const [error, setError] = useState(false)
    const [noSession, setNoSession] = useState(false)
    const [session, setSession] = useState<IORSession>()
    
    useEffect(() => {
        getCurrentSession()
            .then(session => {
                if (!session.data) {
                    setNoSession(true)
                    return
                }
                setSession(session.data)
                return getQuestions(session.data)
            })
            .then(questions => questions && setQuestions(questions.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [])

    const {t} = useTranslation("isepdor")

    const [question, setQuestion] = useState<IORVotedQuestion>()
    const [responding, setResponding] = useState<boolean>(false)
    const input = useRef<HTMLInputElement>(null)

    const [search, setSearch] = useState("")
    
    const [results, setResults] = useState<SearchItem[]>([])
    const [searchError, setSearchError] = useState<boolean>(false)
    const [searchFetching, setSearchFetching] = useState<boolean>(false)
    const [source, setSource] = useState<CancelTokenSource>()


    const searchFunction = useCallback(debounce(async (currentValue: string) => {
        setSearchFetching(true)

        if(!input.current?.value.length)
            return
        
        const tokenSource = Axios.CancelToken.source()
        setSource(tokenSource)

        switch (question?.question.type) {
            case IORQuestionType.STUDENT:
                searchStudent(currentValue, "", 0, tokenSource.token)
                    .then(res => 
                        setResults(res.data.content)
                    )
                    .catch(handleRequestCancellation)
                    .catch(() => setSearchError(true))
                    .finally(() => setSearchFetching(false))
                break
            case IORQuestionType.EVENT:
                searchEvent(currentValue, 0, tokenSource.token, (session?.start.getFullYear() ?? 0) - 1)
                    .then(res => 
                        setResults(res.data.content)
                    )
                    .catch(handleRequestCancellation)
                    .catch(() => setSearchError(true))
                    .finally(() => setSearchFetching(false))
                break
            case IORQuestionType.CLUB:
                searchClub(currentValue, 0, tokenSource.token)
                    .then(res => 
                        setResults(res.data.content)
                    )
                    .catch(handleRequestCancellation)
                    .catch(() => setSearchError(true))
                    .finally(() => setSearchFetching(false))
                break
        }
    }, 300), [question?.question])

    useEffect(() => {
        setSource(source => {
            source?.cancel("Operation canceled due to new request.")
            return undefined
        })
        if(search?.length)
            searchFunction(search)
        else
            setResults([])
    }, [search])

    const openResponding = (question?: IORVotedQuestion) => {
        setResponding(!!question)

        if(question){
            if(input.current) {
                input.current.value = ""
                setSearch("")
            }

            setQuestion(question)
            setTimeout(() => input.current?.focus(), 250)
        }
    }

    const choose = (item: SearchItem) => {
        if(question){
            voteIORQuestion(question.question, item.id).then(question => {
                setQuestions(questions => questions.map(q => q.question.id === question.data.question.id ? {
                    ...question.data,
                    vote: item,
                } : q))
                openResponding(undefined)
            })
        }
    }

    return error || noSession ? <ErrorInterface error={noSession ? "isepdor:no_session" : "error:error_fetch_ior"} /> : loading ? <LoadingPage message="isepdor:loading" /> :
        <>
            <div className="mx-auto container px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-10 mt-8 mb-4">
                {
                    questions.map(question => 
                        <div className="flex flex-col px-4 py-3 rounded-lg bg-white relative shadow-sm" onClick={() => openResponding(question)}>
                            <div className="text-center font-medium text-lg">
                                {question.question.title}
                            </div>
                            <div className="h-0.5 w-[50%] bg-black/5 mx-auto rounded mt-2" />
                            
                            {question?.vote ?
                                <button className="rounded-full bg-neutral-100 px-4 py-2 mt-3 text-neutral-500 hover:bg-neutral-200 transition-colors flex items-center h-10">
                                    <div className="scale-75">
                                        <SearchItemComponent item={question.vote} />
                                    </div>
                                    <span className="ml-0 font-medium text-base">
                                        { question.vote.name }
                                    </span>
                                </button>
                                :
                                <button className="rounded-full bg-neutral-100 px-4 py-2 mt-3 text-neutral-500 hover:bg-neutral-200 transition-colors h-10">
                                    {t("choose")+" "+t(`type.${question.question.type}`)}...
                                </button>
                            }
                        </div>
                    )
                }
                <div className={"fixed inset-0 bg-black/20 z-[999] transition-opacity duration-300 "+(responding ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => openResponding(undefined)}>
                </div>
                <div className={"fixed bottom-0 w-full max-w-lg sm:rounded-lg overflow-hidden left-1/2 -translate-x-1/2 z-[999] -mb-2 flex flex-col-reverse transition-transform duration-300 "+(!responding && "translate-y-full")}>
                    <div className="px-3 py-3 pb-5 z-10 bg-white shadow-md rsounded-t-xl border-t">
                        <div className="text-center font-medium text-lg">
                            {question?.question.title}
                        </div>
                        <div className="h-0.5 w-[50%] bg-black/5 mx-auto rounded mt-2" />
                        {!question?.choices && <input onChange={e => setSearch(e.target.value)} ref={input} className="rounded-full bg-neutral-200 px-4 py-2 mt-3 text-black transition-colors w-full outline-none" placeholder={t("choose")+" "+t(`type.${question?.question.type}`)} />}
                    </div>
                    <div className="bg-white z-0 px-3 py-2 text-center">
                        {
                            (results.length || question?.choices) ? (question?.choices ?? results).slice(0, 5).map(result =>
                                <div onClick={() => choose(result)} className="flex items-center font-medium px-3 py-2 rounded-lg text-lg bg-neutral-100 mt-2 hover:bg-neutral-200 transition-colors cursor-pointer">
                                    <SearchItemComponent item={result} />
                                    <div className="text-black">
                                        {result.name}
                                    </div>
                                </div>
                            ) : <div className="text-neutral-600">
                                {t("search", {type: t(`type.${question?.question.type}`)})}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
}

export default IsepDor