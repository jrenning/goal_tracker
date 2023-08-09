import path from "path"
import {defineConfig} from "vitest/config"
import {loadEnvConfig} from "@next/env"


export default defineConfig(()=>{

    loadEnvConfig(process.cwd())
    return {
    test: {
        environment: "jsdom",
        globals: true,
        threads: false
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src")
        }
    }
}
})

