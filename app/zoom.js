'use client';

import zoomSdk from "@zoom/appssdk"
import {useEffect, useState} from "react";

export default function Zoom() {
    let [config, setConfig] = useState(null)
    useEffect(() => {
        const configure = async () => {
            setConfig(await zoomSdk.config({
                capabilities: [
                    "shareApp"
                ]
            }))
        };
        configure().catch(e => console.error(e))
    }, [])

    console.log("Zoom App Configuration", config);
}