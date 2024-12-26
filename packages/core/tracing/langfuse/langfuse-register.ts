import { Langfuse } from 'langfuse';
import { register } from './instrumentation';
import { env } from 'node:process';


// Register OpenTelemetry once at the top-level
let langfuseRegistered = false;
let langfuse: Langfuse;

export function initLangfuse() {  
  if (langfuseRegistered) {
    return langfuse;
  }
  
  register();

  // Initialize Langfuse
   langfuse = new Langfuse({
    publicKey: env.LANGFUSE_PUBLIC_KEY,
    secretKey: env.LANGFUSE_SECRET_KEY,
    baseUrl: "https://cloud.langfuse.com"
  });
  langfuseRegistered = true;
  return langfuse;
}