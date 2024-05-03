import { Divider } from "antd"

const BDECampaign = () => {
    const days = [["Lun.", 13], ["Mar.", 14], ["Mer.", 15], ["Jeu.", 16]]//, ["Ven.", 17]]
    return <div className="mx-auto container px-4 mt-8 mb-4">
        <div className="grid grid-cols-4 h-full">
            {
                days.map((day, i) => 
                    <div key={i} className="w-full">
                        <div className="mx-auto flex flex-col text-center mb-2">
                            <div className="font-medium text-neutral-500 text-xs">
                                {day[0].toString().toUpperCase()}
                            </div>
                            <div className="font-medium text-neutral-500 text-3xl mt-2">
                                {day[1]}
                            </div>
                        </div>
                        <div className={"border-neutral-300 "+(i %2 == 1 && "border-l")+" "+(i == 1 && "border-r")}>
                            <div className="border-t border-neutral-400/70 w-full shadow-md" />
                            <div className="p-2.5 sm:p-3 flex flex-col gap-1 max-sm:text-xs">
                                <div className="rounded-md bg-green-500 px-2 sm:px-3 py-1 text-white font-semibold">
                                    Petit déj<span className="max-sm:hidden">euner</span>
                                </div>
                                <div className="rounded-md bg-orange-400 px-2 sm:px-3 py-6 text-white font-semibold">
                                    Activités & Repas à NDL
                                </div>
                                {
                                    i%2 == 1 && <>
                                        <div className="rounded-md bg-yellow-600 px-2 py-1 sm:px-3 text-white font-semibold">
                                            Before
                                        </div>  
                                        <div className="rounded-md bg-red-600 p-2 py-3 sm:px-3 text-white font-semibold">
                                            Soirée
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

        <div className="mt-7">
            <Divider className="sm:text-xl">
                Découvre ce qu'a préparé chaque liste
            </Divider>
        </div>
    </div>
}

export default BDECampaign