'use client';

import zoomSdk from "@zoom/appssdk";
import {useEffect, useState} from "react";

export default function Zoom() {
    let [config, setConfig] = useState(null)

    useEffect(() => {
        const configure = async () =>
            setConfig(await zoomSdk.config({
                capabilities: [
                    "shareApp"
                ]
            }))

        configure().catch(e => console.error(e))
    }, [])

    const isZoom = config !== null;

    return (<span>Running in {isZoom ? "Zoom" : "Browser"}</span>);
}