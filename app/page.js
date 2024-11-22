import Image from "next/image";
import dynamic from 'next/dynamic'
import {headers} from "next/headers";

export default async function Home() {
    let Zoom

    // if this header is present - we're in Zoom
    const headersList = await headers()
    const isZoom = headersList.has('x-zoom-app-device-type');

    const loadZoom = () => {
        if (!isZoom) return;

        Zoom = dynamic(() => import('./zoom.js'));

        return (<Zoom/>)
    }

    const renderInstallBtn = () => {
        if (!isZoom) {
            return (
                <div>
                    <a
                        className="rounded border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background  hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        href="/auth/install"
                    >
                        Install now
                    </a>
                </div>
            )
        } else return (<span></span>)
    }

    return (
        <div
            className="grid changethishere grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-1 sm:p-6 pt-6 font-[family-name:var(--font-geist-sans)]">
            <Image
                src="/logo.svg"
                alt="Zoom logo"
                width={180}
                height={32}
                priority
            />
            <main className="flex flex-row gap-x-20 row-start-2 pb-48 items-center justify-items-center sm:items-start">

                <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold text-violet-500">
                        Server Side Check
                    </p>
                    <span> Running in {isZoom ? "Zoom" : "Browser"} </span>

                </div>
            </main>
            <footer className="w-full">
                {renderInstallBtn()}
            </footer>
            {loadZoom()}
        </div>
    )
}