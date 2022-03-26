const StudentCardSkeleton: React.FC = () => 
    <div className="relative bg-neutral-300 animate-pulse rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-52 px-3.5 items-end flex aspect-[18/20]">
        <div className="absolute right-2.5 top-2.5 bg-white/30 rounded-lg backdrop-blur grid place-items-center px-2 py-0.5 text-neutral-600 font-normal text-lg h-7 w-12" />
        <div className="bg-white/40 rounded-xl backdrop-blur grid place-items-center px-2 py-2 leading-6 mb-3 mt-auto w-full text-neutral-800 font-semibold text-lg h-9" />
    </div>

export default StudentCardSkeleton