import React from "react"
import {Skeleton} from "antd"

const GallerySkeleton: React.FC = () => (
    <div className="w-full text-center h-56" key="0">
        <div className="w-full h-56 bg-white p-2 mb-2">
            <Skeleton active loading={true} title paragraph={false} key={0} avatar={false} className="w-full pr-4"/>
            <div className="flex flex-wrap flex-row w-full h-48 mb-3">
                <div className="w-1/2">
                    <Skeleton className="w-full h-40 float-right" key={1} loading={true} active paragraph={false} title={false}/>
                </div>
                <div className="flex flex-wrap flex-row w-1/2 justify-end">
                    <Skeleton className="w-16 h-16" key={2} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={3} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={4} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={5} loading={true} active paragraph={false} title={false}/>
                </div>
            </div>
        </div>
        <div className="w-full h-56 bg-white p-2 mb-32">
            <Skeleton active loading={true} title paragraph={false} key={6} avatar={false} className="w-full pr-4"/>
            <div className="flex flex-wrap flex-row w-full h-48 mb-3">
                <div className="w-1/2">
                    <Skeleton className="w-full h-40 float-right" key={7} loading={true} active paragraph={false} title={false}/>
                </div>
                <div className="flex flex-wrap flex-row w-1/2 justify-end">
                    <Skeleton className="w-16 h-16" key={8} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={9} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={10} loading={true} active paragraph={false} title={false}/>
                    <Skeleton className="w-16 h-16" key={11} loading={true} active paragraph={false} title={false}/>
                </div>
            </div>
        </div>

    </div>
)
export default GallerySkeleton
