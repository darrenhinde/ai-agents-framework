"use server"
import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";



export async function register() {
    console.log("registering langfuse")
    registerOTel({
      serviceName: "langfuse-vercel-ai-nextjs-example",
      traceExporter:new LangfuseExporter(
          {
            debug: false,
          publicKey: process.env.LANGFUSE_PUBLIC_KEY,
          secretKey: process.env.LANGFUSE_SECRET_KEY,
          baseUrl: "https://cloud.langfuse.com"
          }
        )
    })
}