---
title: AI SDK by Vercel
description: Welcome to the AI SDK documentation!
---

# AI SDK

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more.

## Why use the AI SDK?

Integrating large language models (LLMs) into applications is complicated and heavily dependent on the specific model provider you use.

- **[AI SDK Core](/docs/ai-sdk-core):** A unified API for generating text, structured objects, and tool calls with LLMs.
- **[AI SDK UI](/docs/ai-sdk-ui):** A set of framework-agnostic hooks for quickly building chat and generative user interface.

## Model Providers

The AI SDK supports [multiple model providers](/providers).

The open-source community has created the following providers:

- [Ollama Provider](/providers/community-providers/ollama) (`ollama-ai-provider`)
- [ChromeAI Provider](/providers/community-providers/chrome-ai) (`chrome-ai`)
- [AnthropicVertex Provider](/providers/community-providers/anthropic-vertex-ai) (`anthropic-vertex-ai`)
- [FriendliAI Provider](/providers/community-providers/friendliai) (`@friendliai/ai-provider`)
- [Portkey Provider](/providers/community-providers/portkey) (`@portkey-ai/vercel-provider`)
- [Cloudflare Workers AI Provider](/providers/community-providers/cloudflare-workers-ai) (`workers-ai-provider`)
- [Crosshatch Provider](/providers/community-providers/crosshatch) (`@crosshatch/ai-provider`)
- [Mixedbread Provider](/providers/community-providers/mixedbread) (`mixedbread-ai-provider`)
- [Voyage AI Provider](/providers/community-providers/voyage-ai) (`voyage-ai-provider`)
- [Mem0 Provider](/providers/community-providers/mem0)(`@mem0/vercel-ai-provider`)
- [LLamaCpp Provider](/providers/community-providers/llama-cpp) (`llamacpp-ai-provider`)

## Model Capabilities

The AI providers support different language models with various capabilities.
Here are the capabilities of popular models:

| Provider                                                                 | Model                        | Image Input         | Object Generation   | Tool Usage          | Tool Streaming      |
| ------------------------------------------------------------------------ | ---------------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `gpt-4o`                     | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `gpt-4o-mini`                | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `gpt-4-turbo`                | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `gpt-4`                      | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `o1`                         | <Check size={18} /> | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `o1-mini`                    | <Check size={18} /> | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [OpenAI](/providers/ai-sdk-providers/openai)                             | `o1-preview`                 | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| [Anthropic](/providers/ai-sdk-providers/anthropic)                       | `claude-3-5-sonnet-20241022` | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Anthropic](/providers/ai-sdk-providers/anthropic)                       | `claude-3-5-sonnet-20240620` | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Anthropic](/providers/ai-sdk-providers/anthropic)                       | `claude-3-5-haiku-20241022`  | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Mistral](/providers/ai-sdk-providers/mistral)                           | `pixtral-large-latest`       | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Mistral](/providers/ai-sdk-providers/mistral)                           | `mistral-large-latest`       | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Mistral](/providers/ai-sdk-providers/mistral)                           | `mistral-small-latest`       | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Mistral](/providers/ai-sdk-providers/mistral)                           | `pixtral-12b-2409`           | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Generative AI](/providers/ai-sdk-providers/google-generative-ai) | `gemini-2.0-flash-exp`       | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Generative AI](/providers/ai-sdk-providers/google-generative-ai) | `gemini-1.5-flash`           | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Generative AI](/providers/ai-sdk-providers/google-generative-ai) | `gemini-1.5-pro`             | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex)               | `gemini-2.0-flash-exp`       | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex)               | `gemini-1.5-flash`           | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Google Vertex](/providers/ai-sdk-providers/google-vertex)               | `gemini-1.5-pro`             | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [xAI Grok](/providers/ai-sdk-providers/xai)                              | `grok-2-1212`                | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [xAI Grok](/providers/ai-sdk-providers/xai)                              | `grok-2-vision-1212`         | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [xAI Grok](/providers/ai-sdk-providers/xai)                              | `grok-beta`                  | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [xAI Grok](/providers/ai-sdk-providers/xai)                              | `grok-vision-beta`           | <Check size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| [Groq](/providers/ai-sdk-providers/groq)                                 | `llama-3.3-70b-versatile`    | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Groq](/providers/ai-sdk-providers/groq)                                 | `llama-3.1-8b-instant`       | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Groq](/providers/ai-sdk-providers/groq)                                 | `mixtral-8x7b-32768`         | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [Groq](/providers/ai-sdk-providers/groq)                                 | `gemma2-9b-it`               | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |


# Prompts

Prompts are instructions that you give a [large language model (LLM)](/docs/foundations/overview#large-language-models) to tell it what to do.
It's like when you ask someone for directions; the clearer your question, the better the directions you'll get.

Many LLM providers offer complex interfaces for specifying prompts. They involve different roles and message types.
While these interfaces are powerful, they can be hard to use and understand.

In order to simplify prompting, the AI SDK support text, message, and system prompts.

## Text Prompts

Text prompts are strings.
They are ideal for simple generation use cases,
e.g. repeatedly generating content for variants of the same prompt text.

You can set text prompts using the `prompt` property made available by AI SDK functions like [`streamText`](/docs/reference/ai-sdk-core/stream-text) or [`generateObject`](/docs/reference/ai-sdk-core/generate-object).
You can structure the text in any way and inject variables, e.g. using a template literal.

```ts highlight="3"
const result = await generateText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

You can also use template literals to provide dynamic data to your prompt.

```ts highlight="3-5"
const result = await generateText({
  model: yourModel,
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```

## System Prompts

System prompts are the initial set of instructions given to models that help guide and constrain the models' behaviors and responses.
You can set system prompts using the `system` property.
System prompts work with both the `prompt` and the `messages` properties.

```ts highlight="3-6"
const result = await generateText({
  model: yourModel,
  system:
    `You help planning travel itineraries. ` +
    `Respond to the users' request with a list ` +
    `of the best stops to make in their destination.`,
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```

<Note>
  When you use a message prompt, you can also use system messages instead of a
  system prompt.
</Note>

## Message Prompts

A message prompt is an array of user, assistant, and tool messages.
They are great for chat interfaces and more complex, multi-modal prompts.
You can use the `messages` property to set message prompts.

Each message has a `role` and a `content` property. The content can either be text (for user and assistant messages), or an array of relevant parts (data) for that message type.

```ts highlight="3-7"
const result = await streamUI({
  model: yourModel,
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

Instead of sending a text in the `content` property, you can send an array of parts that includes a mix of text and other content parts.

<Note type="warning">
  Not all language models support all message and content types. For example,
  some models might not be capable of handling multi-modal inputs or tool
  messages. [Learn more about the capabilities of select
  models](./providers-and-models#model-capabilities).
</Note>

### User Messages

#### Text Parts

Text content is the most common type of content. It is a string that is passed to the model.

If you only need to send text content in a message, the `content` property can be a string,
but you can also use the `parts` property to send multiple parts of content.

```ts highlight="7"
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Where can I buy the best Currywurst in Berlin?',
        },
      ],
    },
  ],
});
```

#### Image Parts

User messages can include image parts. An image can be one of the following:

- base64-encoded image:
  - `string` with base-64 encoded content
  - data URL `string`, e.g. `data:image/png;base64,...`
- binary image:
  - `ArrayBuffer`
  - `Uint8Array`
  - `Buffer`
- URL:
  - http(s) URL `string`, e.g. `https://example.com/image.png`
  - `URL` object, e.g. `new URL('https://example.com/image.png')`

##### Example: Binary image (Buffer)

```ts highlight="8-11"
const result = await generateText({
  model,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png'),
        },
      ],
    },
  ],
});
```

##### Example: Base-64 encoded image (string)

```ts highlight="8-11"
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png').toString('base64'),
        },
      ],
    },
  ],
});
```

##### Example: Image URL (string)

```ts highlight="8-12"
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image:
            'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        },
      ],
    },
  ],
});
```

#### File Parts

<Note type="warning">
  Only a few providers and models currently support file parts: [Google
  Generative AI](/providers/ai-sdk-providers/google-generative-ai), [Google
  Vertex AI](/providers/ai-sdk-providers/google-vertex),
  [OpenAI](/providers/ai-sdk-providers/openai) (for `wav` and `mp3` audio with
  `gpt-4o-audio-preview`), [Anthropic](/providers/ai-sdk-providers/anthropic)
  (for `pdf`).
</Note>

User messages can include file parts. A file can be one of the following:

- base64-encoded file:
  - `string` with base-64 encoded content
  - data URL `string`, e.g. `data:image/png;base64,...`
- binary data:
  - `ArrayBuffer`
  - `Uint8Array`
  - `Buffer`
- URL:
  - http(s) URL `string`, e.g. `https://example.com/some.pdf`
  - `URL` object, e.g. `new URL('https://example.com/some.pdf')`

You need to specify the MIME type of the file you are sending.

##### Example: PDF file from Buffer

```ts highlight="12-14"
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const result = await generateText({
  model: google('gemini-1.5-flash'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the file about?' },
        {
          type: 'file',
          mimeType: 'application/pdf',
          data: fs.readFileSync('./data/example.pdf'),
        },
      ],
    },
  ],
});
```

##### Example: mp3 audio file from Buffer

```ts highlight="12-14"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-4o-audio-preview'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is the audio saying?' },
        {
          type: 'file',
          mimeType: 'audio/mpeg',
          data: fs.readFileSync('./data/galileo.mp3'),
        },
      ],
    },
  ],
});
```

### Assistant Messages

Assistant messages are messages that have a role of `assistant`.
They are typically previous responses from the assistant and can contain text and tool call parts.

#### Example: Assistant message with text

```ts highlight="5"
const result = await generateText({
  model: yourModel,
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
  ],
});
```

#### Example: Assistant message with tool call

```ts highlight="5-10"
const result = await generateText({
  model: yourModel,
  messages: [
    { role: 'user', content: 'How many calories are in this block of cheese?' },
    {
      type: 'tool-call',
      toolCallId: '12345',
      toolName: 'get-nutrition-data',
      args: { cheese: 'Roquefort' },
    },
  ],
});
```

### Tool messages

<Note>
  [Tools](/docs/foundations/tools) (also known as function calling) are programs
  that you can provide an LLM to extend it's built-in functionality. This can be
  anything from calling an external API to calling functions within your UI.
  Learn more about Tools in [the next section](/docs/foundations/tools).
</Note>

For models that support [tool](/docs/foundations/tools) calls, assistant messages can contain tool call parts, and tool messages can contain tool result parts.
A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.

```ts highlight="14-42"
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'How many calories are in this block of cheese?',
        },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          args: { cheese: 'Roquefort' },
        },
        // there could be more tool calls here (parallel calling)
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          result: {
            name: 'Cheese, roquefort',
            calories: 369,
            fat: 31,
            protein: 22,
          },
        },
        // there could be more tool results here (parallel calling)
      ],
    },
  ],
});
```

#### Multi-modal Tool Results

<Note type="warning">
  Multi-part tool results are experimental and only supported by Anthropic.
</Note>

Tool results can be multi-part and multi-modal, e.g. a text and an image.
You can use the `experimental_content` property on tool parts to specify multi-part tool results.

```ts highlight="20-32"
const result = await generateText({
  model: yourModel,
  messages: [
    // ...
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          // for models that do not support multi-part tool results,
          // you can include a regular result part:
          result: {
            name: 'Cheese, roquefort',
            calories: 369,
            fat: 31,
            protein: 22,
          },
          // for models that support multi-part tool results,
          // you can include a multi-part content part:
          content: [
            {
              type: 'text',
              text: 'Here is an image of the nutrition data for the cheese:',
            },
            {
              type: 'image',
              data: fs.readFileSync('./data/roquefort-nutrition-data.png'),
              mimeType: 'image/png',
            },
          ],
        },
      ],
    },
  ],
});
```

### System Messages

System messages are messages that are sent to the model before the user messages to guide the assistant's behavior.
You can alternatively use the `system` property.

```ts highlight="4"
const result = await generateText({
  model: yourModel,
  messages: [
    { role: 'system', content: 'You help planning travel itineraries.' },
    {
      role: 'user',
      content:
        'I am planning a trip to Berlin for 3 days. Please suggest the best tourist activities for me to do.',
    },
  ],
});
```

---
title: Tools
description: Learn about tools with the AI SDK.
---

# Tools

While [large language models (LLMs)](/docs/foundations/overview#large-language-models) have incredible generation capabilities,
they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather).

Tools are actions that an LLM can invoke.
The results of these actions can be reported back to the LLM to be considered in the next response.

For example, when you ask an LLM for the "weather in London", and there is a weather tool available, it could call a tool
with London as the argument. The tool would then fetch the weather data and return it to the LLM. The LLM can then use this
information in its response.

## What is a tool?

A tool is an object that can be called by the model to perform a specific task.
You can use tools with [`generateText`](/docs/reference/ai-sdk-core/generate-text)
and [`streamText`](/docs/reference/ai-sdk-core/stream-text) by passing one or more tools to the `tools` parameter.

A tool consists of three properties:

- **`description`**: An optional description of the tool that can influence when the tool is picked.
- **`parameters`**: A [Zod schema](/docs/foundations/tools#schema-specification-and-validation-with-zod) or a [JSON schema](/docs/reference/ai-sdk-core/json-schema) that defines the parameters. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
- **`execute`**: An optional async function that is called with the arguments from the tool call.

<Note>
  `streamUI` uses UI generator tools with a `generate` function that can return
  React components.
</Note>

If the LLM decides to use a tool, it will generate a tool call.
Tools with an `execute` function are run automatically when these calls are generated.
The results of the tool calls are returned using tool result objects.

You can automatically pass tool results back to the LLM
using [multi-step calls](/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls) with `streamText` and `generateText`.

## Schemas

Schemas are used to define the parameters for tools and to validate the [tool calls](/docs/ai-sdk-core/tools-and-tool-calling).

The AI SDK supports both raw JSON schemas (using the `jsonSchema` function) and [Zod](https://zod.dev/) schemas.
[Zod](https://zod.dev/) is the most popular JavaScript schema validation library.
You can install Zod with:

<Tabs items={['pnpm', 'npm', 'yarn']}>
  <Tab>
    <Snippet text="pnpm add zod" dark />
  </Tab>
  <Tab>
    <Snippet text="npm install zod" dark />
  </Tab>
  <Tab>
    <Snippet text="yarn add zod" dark />
  </Tab>
</Tabs>

You can then specify a Zod schema, for example:

```ts
import z from 'zod';

const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
```

<Note>
  You can also use schemas for structured output generation with
  [`generateObject`](/docs/reference/ai-sdk-core/generate-object) and
  [`streamObject`](/docs/reference/ai-sdk-core/stream-object).
</Note>

## Toolkits

When you work with tools, you typically need a mix of application specific tools and general purpose tools.
There are several providers that offer pre-built tools as **toolkits** that you can use out of the box:

- **[agentic](https://github.com/transitive-bullshit/agentic)** - A collection of 20+ tools. Most tools connect to access external APIs such as [Exa](https://exa.ai/) or [E2B](https://e2b.dev/).
- **[browserbase](https://github.com/browserbase/js-sdk?tab=readme-ov-file#vercel-ai-sdk-integration)** - Browser tool that runs a headless browser
- **[Stripe agent tools](https://docs.stripe.com/agents)** - Tools for interacting with Stripe.
- **[Toolhouse](https://docs.toolhouse.ai/toolhouse/using-vercel-ai)** - AI function-calling in 3 lines of code for over 25 different actions.

<Note>
  Do you have open source tools or tool libraries that are compatible with the
  AI SDK? Please [file a pull request](https://github.com/vercel/ai/pulls) to
  add them to this list.
</Note>

## Learn more

The AI SDK Core [Tool Calling](/docs/ai-sdk-core/tools-and-tool-calling)
and [Agents](/docs/ai-sdk-core/agents) documentation has more information about tools and tool calling.

---
title: Streaming
description: Why use streaming for AI applications?
---

# Streaming

Streaming conversational text UIs (like ChatGPT) have gained massive popularity over the past few months. This section explores the benefits and drawbacks of streaming and blocking interfaces.

[Large language models (LLMs)](/docs/foundations/overview#large-language-models) are extremely powerful. However, when generating long outputs, they can be very slow compared to the latency you're likely used to. If you try to build a traditional blocking UI, your users might easily find themselves staring at loading spinners for 5, 10, even up to 40s waiting for the entire LLM response to be generated. This can lead to a poor user experience, especially in conversational applications like chatbots. Streaming UIs can help mitigate this issue by **displaying parts of the response as they become available**.

<div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-8">
  <Card
    title="Blocking UI"
    description="Blocking responses wait until the full response is available before displaying it."
  >
    <BrowserIllustration highlight blocking />
  </Card>
  <Card
    title="Streaming UI"
    description="Streaming responses can transmit parts of the response as they become available."
  >
    <BrowserIllustration highlight />
  </Card>
</div>

## Real-world Examples

Here are 2 examples that illustrate how streaming UIs can improve user experiences in a real-world setting – the first uses a blocking UI, while the second uses a streaming UI.

### Blocking UI

<InlinePrompt
  initialInput="Come up with the first 200 characters of the first book in the Harry Potter series."
  blocking
/>

### Streaming UI

<InlinePrompt initialInput="Come up with the first 200 characters of the first book in the Harry Potter series." />

As you can see, the streaming UI is able to start displaying the response much faster than the blocking UI. This is because the blocking UI has to wait for the entire response to be generated before it can display anything, while the streaming UI can display parts of the response as they become available.

While streaming interfaces can greatly enhance user experiences, especially with larger language models, they aren't always necessary or beneficial. If you can achieve your desired functionality using a smaller, faster model without resorting to streaming, this route can often lead to simpler and more manageable development processes.

However, regardless of the speed of your model, the AI SDK is designed to make implementing streaming UIs as simple as possible. In the example below, we stream text generation from OpenAI's `gpt-4-turbo` in under 10 lines of code using the SDK's [`streamText`](/docs/reference/ai-sdk-core/stream-text) function:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const { textStream } = streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a poem about embedding models.',
});

for await (const textPart of textStream) {
  console.log(textPart);
}
```

For an introduction to streaming UIs and the AI SDK, check out our [Getting Started guides](/docs/getting-started).

---
title: Foundations
description: A section that covers foundational knowledge around LLMs and concepts crucial to the AI SDK
---

# Foundations

<IndexCards
  cards={[
    {
      title: 'Overview',
      description: 'Learn about foundational concepts around AI and LLMs.',
      href: '/docs/foundations/overview',
    },
    {
      title: 'Providers and Models',
      description:
        'Learn about the providers and models that you can use with the AI SDK.',
      href: '/docs/foundations/providers-and-models',
    },
    {
      title: 'Prompts',
      description:
        'Learn about how Prompts are used and defined in the AI SDK.',
      href: '/docs/foundations/prompts',
    },
    {
      title: 'Tools',
      description: 'Learn about tools in the AI SDK.',
      href: '/docs/foundations/tools',
    },
    {
      title: 'Streaming',
      description: 'Learn why streaming is used for AI applications.',
      href: '/docs/foundations/streaming',
    },
  ]}
/>

---
title: Navigating the Library
description: Learn how to navigate the AI SDK.
---

# Navigating the Library

the AI SDK is a powerful toolkit for building AI applications. This page will help you pick the right tools for your requirements.

Let’s start with a quick overview of the AI SDK, which is comprised of three parts:

- **[AI SDK Core](/docs/ai-sdk-core/overview):** A unified, provider agnostic API for generating text, structured objects, and tool calls with LLMs.
- **[AI SDK UI](/docs/ai-sdk-ui/overview):** A set of framework-agnostic hooks for building chat and generative user interfaces.
- [AI SDK RSC](/docs/ai-sdk-rsc/overview): Stream generative user interfaces with React Server Components (RSC). Development is currently experimental and we recommend using [AI SDK UI](/docs/ai-sdk-ui/overview).

## Choosing the Right Tool for Your Environment

When deciding which part of the AI SDK to use, your first consideration should be the environment and existing stack you are working with. Different components of the SDK are tailored to specific frameworks and environments.

| Library                                   | Purpose                                                                                                                                                                                                  | Environment Compatibility                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [AI SDK Core](/docs/ai-sdk-core/overview) | Call any LLM with unified API (e.g. [generateText](/docs/reference/ai-sdk-core/generate-text) and [generateObject](/docs/reference/ai-sdk-core/generate-object))                                         | Any JS environment (e.g. Node.js, Deno, Browser)                       |
| [AI SDK UI](/docs/ai-sdk-ui/overview)     | Build streaming chat and generative UIs (e.g. [useChat](/docs/reference/ai-sdk-ui/use-chat))                                                                                                             | React & Next.js, Vue & Nuxt, Svelte & SvelteKit, Solid.js & SolidStart |
| [AI SDK RSC](/docs/ai-sdk-rsc/overview)   | Stream generative UIs from Server to Client (e.g. [streamUI](/docs/reference/ai-sdk-rsc/stream-ui)). Development is currently experimental and we recommend using [AI SDK UI](/docs/ai-sdk-ui/overview). | Any framework that supports React Server Components (e.g. Next.js)     |

## Environment Compatibility

These tools have been designed to work seamlessly with each other and it's likely that you will be using them together. Let's look at how you could decide which libraries to use based on your application environment, existing stack, and requirements.

The following table outlines AI SDK compatibility based on environment:

| Environment           | [AI SDK Core](/docs/ai-sdk-core/overview) | [AI SDK UI](/docs/ai-sdk-ui/overview) | [AI SDK RSC](/docs/ai-sdk-rsc/overview) |
| --------------------- | ----------------------------------------- | ------------------------------------- | --------------------------------------- |
| None / Node.js / Deno | <Check size={18} />                       | <Cross size={18} />                   | <Cross size={18} />                     |
| Vue / Nuxt            | <Check size={18} />                       | <Check size={18} />                   | <Cross size={18} />                     |
| Svelte / SvelteKit    | <Check size={18} />                       | <Check size={18} />                   | <Cross size={18} />                     |
| Solid.js / SolidStart | <Check size={18} />                       | <Check size={18} />                   | <Cross size={18} />                     |
| Next.js Pages Router  | <Check size={18} />                       | <Check size={18} />                   | <Cross size={18} />                     |
| Next.js App Router    | <Check size={18} />                       | <Check size={18} />                   | <Check size={18} />                     |

## When to use AI SDK UI

AI SDK UI provides a set of framework-agnostic hooks for quickly building **production-ready AI-native applications**. It offers:

- Full support for streaming chat and client-side generative UI
- Utilities for handling common AI interaction patterns (i.e. chat, completion, assistant)
- Production-tested reliability and performance
- Compatibility across popular frameworks

## AI SDK UI Framework Compatibility

AI SDK UI supports the following frameworks: [React](https://react.dev/), [Svelte](https://svelte.dev/), [Vue.js](https://vuejs.org/), and [SolidJS](https://www.solidjs.com/). Here is a comparison of the supported functions across these frameworks:

| Function                                                   | React               | Svelte              | Vue.js              | SolidJS             |
| ---------------------------------------------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| [useChat](/docs/reference/ai-sdk-ui/use-chat)              | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [useChat](/docs/reference/ai-sdk-ui/use-chat) tool calling | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> | <Check size={18} /> |
| [useChat](/docs/reference/ai-sdk-ui/use-chat) attachments  | <Check size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| [useCompletion](/docs/reference/ai-sdk-ui/use-completion)  | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [useObject](/docs/reference/ai-sdk-ui/use-object)          | <Check size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| [useAssistant](/docs/reference/ai-sdk-ui/use-assistant)    | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |

<Note>
  [Contributions](https://github.com/vercel/ai/blob/main/CONTRIBUTING.md) are
  welcome to implement missing features for non-React frameworks.
</Note>

## When to use AI SDK RSC

<Note type="warning">
  AI SDK RSC is currently experimental. We recommend using [AI SDK
  UI](/docs/ai-sdk-ui/overview) for production. For guidance on migrating from
  RSC to UI, see our [migration guide](/docs/ai-sdk-rsc/migrating-to-ui).
</Note>

[React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
(RSCs) provide a new approach to building React applications that allow components
to render on the server, fetch data directly, and stream the results to the client,
reducing bundle size and improving performance. They also introduce a new way to
call server-side functions from anywhere in your application called [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

AI SDK RSC provides a number of utilities that allow you to stream values and UI directly from the server to the client. However, **it's important to be aware of current limitations**:

- **Cancellation**: currently, it is not possible to abort a stream using Server Actions. This will be improved in future releases of React and Next.js.
- **Increased Data Transfer**: using [`createStreamableUI`](/docs/reference/ai-sdk-rsc/create-streamable-ui) can lead to quadratic data transfer (quadratic to the length of generated text). You can avoid this using [ `createStreamableValue` ](/docs/reference/ai-sdk-rsc/create-streamable-value) instead, and rendering the component client-side.
- **Re-mounting Issue During Streaming**: when using `createStreamableUI`, components re-mount on `.done()`, causing [flickering](https://github.com/vercel/ai/issues/2232).

Given these limitations, **we recommend using [AI SDK UI](/docs/ai-sdk-ui/overview) for production applications**.

---
title: Next.js App Router
description: Welcome to the AI SDK quickstart guide for Next.js App Router!
---

# Next.js App Router Quickstart

In this quick start tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

Check out [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/advanced/why-streaming) if you haven't heard of them.

## Prerequisites

To follow this quickstart, you'll need:

- Node.js 18+ and pnpm installed on your local development machine.
- An OpenAI API key.

If you haven't obtained your OpenAI API key, you can do so by [signing up](https://platform.openai.com/signup/) on the OpenAI website.

## Create Your Application

Start by creating a new Next.js application. This command will create a new directory named `my-ai-app` and set up a basic Next.js application inside it.

<div className="mb-4">
  <Note>
    Be sure to select yes when prompted to use the App Router. If you are
    looking for the Next.js Pages Router quickstart guide, you can find it
    [here](/docs/getting-started/nextjs-pages-router).
  </Note>
</div>

<Snippet text="pnpm create next-app@latest my-ai-app" />

Navigate to the newly created directory:

<Snippet text="cd my-ai-app" />

### Install dependencies

Install `ai` and `@ai-sdk/openai`, the AI package and AI SDK's [ OpenAI provider ](/providers/ai-sdk-providers/openai) respectively.

<Note>
  The AI SDK is designed to be a unified interface to interact with any large
  language model. This means that you can change model and providers with just
  one line of code! Learn more about [available providers](/providers) and
  [building custom providers](/providers/community-providers/custom-providers)
  in the [providers](/providers) section.
</Note>
<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add ai @ai-sdk/openai zod" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install ai @ai-sdk/openai zod" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add ai @ai-sdk/openai zod" dark />
    </Tab>
  </Tabs>
</div>

<Note type="secondary" fill>
  Make sure you are using `ai` version 3.1 or higher.
</Note>

### Configure OpenAI API key

Create a `.env.local` file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

<Snippet text="touch .env.local" />

Edit the `.env.local` file:

```env filename=".env.local"
OPENAI_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual OpenAI API key.

<Note className="mb-4">
  The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY`
  environment variable.
</Note>

## Create a Route Handler

Create a route handler, `app/api/chat/route.ts` and add the following code:

```tsx filename="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

Let's take a look at what is happening in this code:

1. Define an asynchronous `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation.
2. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (imported from `@ai-sdk/openai`) and `messages` (defined in step 1). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customise the model's behaviour.
3. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result-object). This result object contains the [ `toDataStreamResponse` ](/docs/reference/ai-sdk-core/stream-text#to-data-stream-response) function which converts the result to a streamed response object.
4. Finally, return the result to the client to stream the response.

This Route Handler creates a POST request endpoint at `/api/chat`.

## Wire up the UI

Now that you have a Route Handler that can query an LLM, it's time to setup your frontend. The AI SDK's [ UI ](/docs/ai-sdk-ui) package abstracts the complexity of a chat interface into one hook, [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your root page (`app/page.tsx`) with the following code to show a list of chat messages and provide a user message input:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

<Note>
  Make sure you add the `"use client"` directive to the top of your file. This
  allows you to add interactivity with Javascript.
</Note>

This page utilizes the `useChat` hook, which will, by default, use the `POST` API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

- `messages` - the current chat messages (an array of objects with `id`, `role`, and `content` properties).
- `input` - the current value of the user's input field.
- `handleInputChange` and `handleSubmit` - functions to handle user interactions (typing into the input field and submitting the form, respectively).

## Running Your Application

With that, you have built everything you need for your chatbot! To start your application, use the command:

<Snippet text="pnpm run dev" />

Head to your browser and open http://localhost:3000. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! The AI SDK makes it fast and easy to build AI chat interfaces with Next.js.

## Enhance Your Chatbot with Tools

While large language models (LLMs) have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). This is where [tools](/docs/ai-sdk-core/tools-and-tool-calling) come in.

Tools are actions that an LLM can invoke. The results of these actions can be reported back to the LLM to be considered in the next response.

For example, if a user asks about the current weather, without tools, the model would only be able to provide general information based on its training data. But with a weather tool, it can fetch and provide up-to-date, location-specific weather information.

Let's enhance your chatbot by adding a simple weather tool.

### Update Your Route Handler

Modify your `app/api/chat/route.ts` file to include the new weather tool:

```tsx filename="app/api/chat/route.ts" highlight="2,13-27"
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

In this updated code:

1. You import the `tool` function from the `ai` package and `z` from `zod` for schema validation.
2. You define a `tools` object with a `weather` tool. This tool:

   - Has a description that helps the model understand when to use it.
   - Defines parameters using a Zod schema, specifying that it requires a `location` string to execute this tool. The model will attempt to extract this parameter from the context of the conversation. If it can't, it will ask the user for the missing information.
   - Defines an `execute` function that simulates getting weather data (in this case, it returns a random temperature). This is an asynchronous function running on the server so you can fetch real data from an external API.

   Now your chatbot can "fetch" weather information for any location the user asks about. When the model determines it needs to use the weather tool, it will generate a tool call with the necessary parameters. The `execute` function will then be automatically run, and you can access the results via `toolInvocations` that is available on the message object.

Try asking something like "What's the weather in New York?" and see how the model uses the new tool.

Notice the blank response in the UI? This is because instead of generating a text response, the model generated a tool call. You can access the tool call and subsequent tool result in the `toolInvocations` key of the message object.

### Update the UI

To display the tool invocations in your UI, update your `app/page.tsx` file:

```tsx filename="app/page.tsx" highlight="12-16"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.toolInvocations ? (
            <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
          ) : (
            <p>{m.content}</p>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

With this change, you check each message for any tool calls (`toolInvocations`). These tool calls will be displayed as stringified JSON. Otherwise, you show the message content as before.

Now, when you ask about the weather, you'll see the tool invocation and its result displayed in your chat interface.

## Enabling Multi-Step Tool Calls

You may have noticed that while the tool results are visible in the chat interface, the model isn't using this information to answer your original query. This is because once the model generates a tool call, it has technically completed its generation.

To solve this, you can enable multi-step tool calls using the `maxSteps` option in your `useChat` hook. This feature will automatically send tool results back to the model to trigger an additional generation. In this case, you want the model to answer your question using the results from the weather tool.

### Update Your Client-Side Code

Modify your `app/page.tsx` file to include the `maxSteps` option:

```tsx filename="app/page.tsx" highlight="7"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  // ... rest of your component code
}
```

Head back to the browser and ask about the weather in a location. You should now see the model using the weather tool results to answer your question.

By setting `maxSteps` to 5, you're allowing the model to use up to 5 "steps" for any given generation. This enables more complex interactions and allows the model to gather and process information over several steps if needed. You can see this in action by adding another tool to convert the temperature from Fahrenheit to Celsius.

### Update Your Route Handler

Update your `app/api/chat/route.ts` file to add a new tool to convert the temperature from Fahrenheit to Celsius:

```tsx filename="app/api/chat/route.ts" highlight="27-40"
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        parameters: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

Now, when you ask "What's the weather in New York in celsius?", you should see a more complete interaction:

1. The model will call the weather tool for New York.
2. You'll see the tool result displayed.
3. It will then call the temperature conversion tool to convert the temperature from Fahrenheit to Celsius.
4. The model will then use that information to provide a natural language response about the weather in New York.

This multi-step approach allows the model to gather information and use it to provide more accurate and contextual responses, making your chatbot considerably more useful.

This simple example demonstrates how tools can expand your model's capabilities. You can create more complex tools to integrate with real APIs, databases, or any other external systems, allowing the model to access and process real-world data in real-time. Tools bridge the gap between the model's knowledge cutoff and current information.

## Where to Next?

You've built an AI chatbot using the AI SDK! From here, you have several paths to explore:

- To learn more about the AI SDK, read through the [documentation](/docs).
- If you're interested in diving deeper with guides, check out the [RAG (retrieval-augmented generation)](/docs/guides/rag-chatbot) and [multi-modal chatbot](/docs/guides/multi-modal-chatbot) guides.
- To jumpstart your first AI project, explore available [templates](https://vercel.com/templates?type=ai).


# Node.js Quickstart

In this quickstart tutorial, you'll build a simple AI chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of [Prompt Engineering](/docs/advanced/prompt-engineering) and [HTTP Streaming](/docs/advanced/why-streaming), you can optionally read these documents first.

## Prerequisites

To follow this quickstart, you'll need:

- Node.js 18+ and pnpm installed on your local development machine.
- An OpenAI API key.

If you haven't obtained your OpenAI API key, you can do so by [signing up](https://platform.openai.com/signup/) on the OpenAI website.

## Setup Your Application

Start by creating a new directory using the `mkdir` command. Change into your new directory and then run the `pnpm init` command. This will create a `package.json` in your new directory.

```bash
mkdir my-ai-app
cd my-ai-app
pnpm init
```

---
title: Getting Started
description: Welcome to the AI SDK documentation!
---

# Getting Started

The following guides are intended to provide you with an introduction to some of the core features provided by the AI SDK.

<QuickstartFrameworkCards />

## Backend Framework Examples

You can also use [AI SDK Core](/docs/ai-sdk-core/overview) and [AI SDK UI](/docs/ai-sdk-ui/overview) with the following backend frameworks:

<IndexCards
  cards={[
    {
      title: 'Node.js HTTP Server',
      description: 'Send AI responses from a No
### Improving UX with Multi-Step Calls

It would be nice if the model could summarize the action too. However, technically, once the model calls a tool, it has completed its generation as it ‘generated’ a tool call. How could you achieve this desired behaviour?

The AI SDK has a feature called [`maxSteps`](/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls) which will automatically send tool call results back to the model!

Open your root page (`app/page.tsx`) and add the following key to the `useChat` configuration object:

```tsx filename="app/page.tsx" highlight="3-5"
// ... Rest of your code

const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxSteps: 3,
});

// ... Rest of your code
```

Head back to the browser and tell the model your favorite pizza topping (note: pineapple is not an option). You should see a follow-up response from the model confirming the action.

### Retrieve Resource Tool

The model can now add and embed arbitrary information to your knowledge base. However, it still isn’t able to query it. Let’s create a new tool to allow the model to answer questions by finding relevant information in your knowledge base.

To find similar content, you will need to embed the users query, search the database for semantic similarities, then pass those items to the model as context alongside the query. To achieve this, let’s update your embedding logic file (`lib/ai/embedding.ts`):

```tsx filename="lib/ai/embedding.ts" highlight="1,3-5,27-34,36-49"
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
```

In this code, you add two functions:

- `generateEmbedding`: generate a single embedding from an input string
- `findRelevantContent`: embeds the user’s query, searches the database for similar items, then returns relevant items

With that done, it’s onto the final step: creating the tool.

Go back to your route handler (`api/chat/route.ts`) and add a new tool called `getInformation`:

```ts filename="api/chat/route.ts" highlight="5,30-36"
import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

Head back to the browser, refresh the page, and ask for your favorite food. You should see the model call the `getInformation` tool, and then use the relevant information to formulate a response!

## Conclusion

Congratulations, you have successfully built an AI chatbot that can dynamically add and retrieve information to and from a knowledge base. Throughout this guide, you learned how to create and store embeddings, set up server actions to manage resources, and use tools to extend the capabilities of your chatbot.

---
title: Multi-Modal Chatbot
description: Learn how to build a multi-modal chatbot with the AI SDK!
---

# Multi-Modal Chatbot

In this guide, you will build a multi-modal AI-chatbot with a streaming user interface.

Multi-modal refers to the ability of the chatbot to understand and generate responses in multiple formats, such as text, images, and videos. In this example, we will focus on sending images and generating text-based responses.

## Prerequisites

To follow this quickstart, you'll need:

- Node.js 18+ and pnpm installed on your local development machine.
- An OpenAI API key.

If you haven't obtained your OpenAI API key, you can do so by [signing up](https://platform.openai.com/signup/) on the OpenAI website.

## Create Your Application

Start by creating a new Next.js application. This command will create a new directory named `multi-modal-chatbot` and set up a basic Next.js application inside it.

<div className="mb-4">
  <Note>
    Be sure to select yes when prompted to use the App Router. If you are
    looking for the Next.js Pages Router quickstart guide, you can find it
    [here](/docs/getting-started/nextjs-pages-router).
  </Note>
</div>

<Snippet text="pnpm create next-app@latest multi-modal-chatbot" />

Navigate to the newly created directory:

<Snippet text="cd multi-modal-chatbot" />

### Install dependencies

Install `ai` and `@ai-sdk/openai`, the Vercel AI package and the AI SDK's [ OpenAI provider ](/providers/ai-sdk-providers/openai) respectively.

<Note>
  The AI SDK is designed to be a unified interface to interact with any large
  language model. This means that you can change model and providers with just
  one line of code! Learn more about [available providers](/providers) and
  [building custom providers](/providers/community-providers/custom-providers)
  in the [providers](/providers) section.
</Note>
<div className="my-4">
  <Tabs items={['pnpm', 'npm', 'yarn']}>
    <Tab>
      <Snippet text="pnpm add ai @ai-sdk/openai" dark />
    </Tab>
    <Tab>
      <Snippet text="npm install ai @ai-sdk/openai" dark />
    </Tab>
    <Tab>
      <Snippet text="yarn add ai @ai-sdk/openai" dark />
    </Tab>
  </Tabs>
</div>

<Note type="secondary" fill>
  Make sure you are using `ai` version 3.2.27 or higher.
</Note>

### Configure OpenAI API key

Create a `.env.local` file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

<Snippet text="touch .env.local" />

Edit the `.env.local` file:

```env filename=".env.local"
OPENAI_API_KEY=xxxxxxxxx
```

Replace `xxxxxxxxx` with your actual OpenAI API key.

<Note className="mb-4">
  The AI SDK's OpenAI Provider will default to using the `OPENAI_API_KEY`
  environment variable.
</Note>

## Implementation Plan

To build a multi-modal chatbot, you will need to:

- Create a Route Handler to handle incoming chat messages and generate responses.
- Wire up the UI to display chat messages, provide a user input, and handle submitting new messages.
- Add the ability to upload images and attach them alongside the chat messages.

## Create a Route Handler

Create a route handler, `app/api/chat/route.ts` and add the following code:

```tsx filename="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

Let's take a look at what is happening in this code:

1. Define an asynchronous `POST` request handler and extract `messages` from the body of the request. The `messages` variable contains a history of the conversation between you and the chatbot and provides the chatbot with the necessary context to make the next generation.
2. Call [`streamText`](/docs/reference/ai-sdk-core/stream-text), which is imported from the `ai` package. This function accepts a configuration object that contains a `model` provider (imported from `@ai-sdk/openai`) and `messages` (defined in step 1). You can pass additional [settings](/docs/ai-sdk-core/settings) to further customise the model's behaviour.
3. The `streamText` function returns a [`StreamTextResult`](/docs/reference/ai-sdk-core/stream-text#result-object). This result object contains the [ `toDataStreamResponse` ](/docs/reference/ai-sdk-core/stream-text#to-ai-stream-response) function which converts the result to a streamed response object.
4. Finally, return the result to the client to stream the response.

This Route Handler creates a POST request endpoint at `/api/chat`.

## Wire up the UI

Now that you have a Route Handler that can query a large language model (LLM), it's time to setup your frontend. [ AI SDK UI ](/docs/ai-sdk-ui) abstracts the complexity of a chat interface into one hook, [`useChat`](/docs/reference/ai-sdk-ui/use-chat).

Update your root page (`app/page.tsx`) with the following code to show a list of chat messages and provide a user message input:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

<Note>
  Make sure you add the `"use client"` directive to the top of your file. This
  allows you to add interactivity with Javascript.
</Note>

This page utilizes the `useChat` hook, which will, by default, use the `POST` API route you created earlier (`/api/chat`). The hook provides functions and state for handling user input and form submission. The `useChat` hook provides multiple utility functions and state variables:

- `messages` - the current chat messages (an array of objects with `id`, `role`, and `content` properties).
- `input` - the current value of the user's input field.
- `handleInputChange` and `handleSubmit` - functions to handle user interactions (typing into the input field and submitting the form, respectively).
- `isLoading` - boolean that indicates whether the API request is in progress.

## Add Image Upload

To make your chatbot multi-modal, let's add the ability to upload and send images to the model. There are two ways to send attachments alongside a message with the `useChat` hook: by [ providing a `FileList` object ](/docs/ai-sdk-ui/chatbot#filelist) or a [ list of URLs ](/docs/ai-sdk-ui/chatbot#urls) to the `handleSubmit` function. In this guide, you will be using the `FileList` approach as it does not require any additional setup.

Update your root page (`app/page.tsx`) with the following code:

```tsx filename="app/page.tsx" highlight="4-5,10-11,19-33,39-49,51-61"
'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter(attachment =>
                attachment?.contentType?.startsWith('image/'),
              )
              .map((attachment, index) => (
                <Image
                  key={`${m.id}-${index}`}
                  src={attachment.url}
                  width={500}
                  height={500}
                  alt={attachment.name ?? `attachment-${index}`}
                />
              ))}
          </div>
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          className=""
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

In this code, you:

1. Create state to hold the files and create a ref to the file input field.
2. Display the "uploaded" files in the UI.
3. Update the `onSubmit` function, to call the `handleSubmit` function manually, passing the the files as an option using the `experimental_attachments` key.
4. Add a file input field to the form, including an `onChange` handler to handle updating the files state.

## Running Your Application

With that, you have built everything you need for your multi-modal chatbot! To start your application, use the command:

<Snippet text="pnpm run dev" />

Head to your browser and open http://localhost:3000. You should see an input field and a button to upload an image.

Upload a file and ask the model to describe what it sees. Watch as the model's response is streamed back to you!

## Where to Next?

You've built a multi-modal AI chatbot using the AI SDK! Experiment and extend the functionality of this application further by exploring [tool calling](/docs/ai-sdk-core/tools-and-tool-calling) or introducing more granular control over [AI and UI states](/docs/ai-sdk-rsc/generative-ui-state).

If you are looking to leverage the broader capabilities of LLMs, Vercel [AI SDK Core](/docs/ai-sdk-core) provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.

---
title: Get started with Llama 3.1
description: Get started with Llama 3.1 using the AI SDK.
---

# Get started with Llama 3.1

With the [release of Llama 3.1](https://ai.meta.com/blog/meta-llama-3-1/), there has never been a better time to start building AI applications.

The [AI SDK](/) is a powerful TypeScript toolkit for building AI application with large language models (LLMs) like Llama 3.1 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more

## Llama 3.1

The release of Meta's Llama 3.1 is an important moment in AI development. As the first state-of-the-art open weight AI model, Llama 3.1 is helping accelerate developers building AI apps. Available in 8B, 70B, and 405B sizes, these instruction-tuned models work well for tasks like dialogue generation, translation, reasoning, and code generation.

## Benchmarks

Llama 3.1 surpasses most available open-source chat models on common industry benchmarks and even outperforms some closed-source models, offering superior performance in language nuances, contextual understanding, and complex multi-step tasks. The models' refined post-training processes significantly improve response alignment, reduce false refusal rates, and enhance answer diversity, making Llama 3.1 a powerful and accessible tool for building generative AI applications.

![Llama 3.1 Benchmarks](/images/llama-3_1-benchmarks.png)
Source: [Meta AI - Llama 3.1 Model Card](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md)

## Choosing Model Size

Llama 3.1 includes a new 405B parameter model, becoming the largest open-source model available today. This model is designed to handle the most complex and demanding tasks.

When choosing between the different sizes of Llama 3.1 models (405B, 70B, 8B), consider the trade-off between performance and computational requirements. The 405B model offers the highest accuracy and capability for complex tasks but requires significant computational resources. The 70B model provides a good balance of performance and efficiency for most applications, while the 8B model is suitable for simpler tasks or resource-constrained environments where speed and lower computational overhead are priorities.

## Getting Started with the AI SDK

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](/docs/ai-sdk-core/overview), which provides a unified API to call any LLM. The code snippet below is all you need to call Llama 3.1 (using [Groq](https://groq.com)) with the AI SDK:

```tsx
import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const { text } = await generateText({
  model: groq('llama-3.1-405b-reasoning'),
  prompt: 'What is love?',
});
```

<Note>
  Llama 3.1 is available to use with many AI SDK providers including
  [Groq](/providers/ai-sdk-providers/groq), [Amazon
  Bedrock](/providers/ai-sdk-providers/amazon-bedrock),
  [Perplexity](/providers/ai-sdk-providers/perplexity),
  [Baseten](/providers/openai-compatible-providers/baseten)
  [Fireworks](/providers/ai-sdk-providers/fireworks), and more.
</Note>

AI SDK Core abstracts away the differences between model providers, allowing you to focus on building great applications. Prefer to use [Amazon Bedrock](/providers/ai-sdk-providers/amazon-bedrock)? The unified interface also means that you can easily switch between models by changing just two lines of code.

```tsx highlight="2,5"
import { generateText } from 'ai';
import { bedrock } from '@ai-sdk/amazon-bedrock';

const { text } = await generateText({
  model: bedrock('meta.llama3-1-405b-instruct-v1'),
  prompt: 'What is love?',
});
```

### Streaming the Response

To stream the model's response as it's being generated, update your code snippet to use the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function.

```tsx
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const { textStream } = streamText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is love?',
});
```

### Generating Structured Data

While text generation can be useful, you might want to generate structured JSON data. For example, you might want to extract information from text, classify data, or generate synthetic data. AI SDK Core provides two functions ([`generateObject`](/docs/reference/ai-sdk-core/generate-object) and [`streamObject`](/docs/reference/ai-sdk-core/stream-object)) to generate structured data, allowing you to constrain model outputs to a specific schema.

```tsx
import { generateObject } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const { object } = await generateObject({
  model: groq('llama-3.1-70b-versatile'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

This code snippet will generate a type-safe recipe that conforms to the specified zod schema.

### Tools

While LLMs have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). The solution: tools, which are like programs that you provide to the model, which it can choose to call as necessary.

### Using Tools with the AI SDK

The AI SDK supports tool usage across several of its functions, including [`generateText`](/docs/reference/ai-sdk-core/generate-text) and [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui). By passing one or more tools to the `tools` parameter, you can extend the capabilities of LLMs, allowing them to perform discrete tasks and interact with external systems.

Here's an example of how you can use a tool with the AI SDK and Llama 3.1:

```tsx
import { generateText, tool } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { getWeather } from './weatherTool';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const { text } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is the weather like today?',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
});
```

In this example, the `getWeather` tool allows the model to fetch real-time weather data, enhancing its ability to provide accurate and up-to-date information.

### Agents

Agents take your AI applications a step further by allowing models to execute multiple steps (i.e. tools) in a non-deterministic way, making decisions based on context and user input.

Agents use LLMs to choose the next step in a problem-solving process. They can reason at each step and make decisions based on the evolving context.

### Implementing Agents with the AI SDK

The AI SDK supports agent implementation through the `maxSteps` parameter. This allows the model to make multiple decisions and tool calls in a single interaction.

Here's an example of an agent that solves math problems:

```tsx
import { generateText, tool } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import * as mathjs from 'mathjs';
import { z } from 'zod';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const problem =
  'Calculate the profit for a day if revenue is $5000 and expenses are $3500.';

const { text: answer } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  system:
    'You are solving math problems. Reason step by step. Use the calculator when necessary.',
  prompt: problem,
  tools: {
    calculate: tool({
      description: 'A tool for evaluating mathematical expressions.',
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }) => mathjs.evaluate(expression),
    }),
  },
  maxSteps: 5,
});
```

In this example, the agent can use the calculator tool multiple times if needed, reasoning through the problem step by step.

### Building Interactive Interfaces

AI SDK Core can be paired with [AI SDK UI](/docs/ai-sdk-ui/overview), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](/docs/reference/ai-sdk-ui/use-chat), [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion), [`useObject`](/docs/reference/ai-sdk-ui/use-object), and [`useAssistant`](/docs/reference/ai-sdk-ui/use-assistant) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and Llama 3.1 (via [Groq](https://groq.com/)):

```tsx filename="app/api/chat/route.ts"
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('llama-3.1-70b-versatile'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

### Going Beyond Text

The AI SDK's React Server Components (RSC) API enables you to create rich, interactive interfaces that go beyond simple text generation. With the [`streamUI`](/docs/reference/ai-sdk-rsc/stream-ui) function, you can dynamically stream React components from the server to the client.

Let's dive into how you can leverage tools with [AI SDK RSC](/docs/ai-sdk-rsc/overview) to build a generative user interface with Next.js (App Router).

First, create a Server Action.

```tsx filename="app/actions.tsx"
'use server';

import { streamUI } from 'ai/rsc';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function streamComponent() {
  const result = await streamUI({
    model: groq('llama-3.1-70b-versatile'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({ location: z.string() }),
        generate: async function* ({ location }) {
          yield <div>loading...</div>;
          const weather = '25c'; // await getWeather(location);
          return (
            <div>
              the weather in {location} is {weather}.
            </div>
          );
        },
      },
    },
  });
  return result.value;
}
```

In this example, if the model decides to use the `getWeather` tool, it will first yield a `div` while fetching the weather data, then return a weather component with the fetched data (note: static data in this example). This allows for a more dynamic and responsive UI that can adapt based on the AI's decisions and external data.

On the frontend, you can call this Server Action like any other asynchronous function in your application. In this case, the function returns a regular React component.

```tsx filename="app/page.tsx"
'use client';

import { useState } from 'react';
import { streamComponent } from './actions';

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();

  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

To see AI SDK RSC in action, check out our open-source [Next.js Gemini Chatbot](https://gemini.vercel.ai/).

## Migrate from OpenAI

One of the key advantages of the AI SDK is its unified API, which makes it incredibly easy to switch between different AI models and providers. This flexibility is particularly useful when you want to migrate from one model to another, such as moving from OpenAI's GPT models to Meta's Llama models hosted on Groq.

Here's how simple the migration process can be:

**OpenAI Example:**

```tsx
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'What is love?',
});
```

**Llama on Groq Example:**

```tsx
import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const { text } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is love?',
});
```

Thanks to the unified API, the core structure of the code remains the same. The main differences are:

1. Creating a Groq client
2. Changing the model name from `openai("gpt-4-turbo")` to `groq("llama-3.1-70b-versatile")`.

With just these few changes, you've migrated from using OpenAI's GPT-4-Turbo to Meta's Llama 3.1 hosted on Groq. The `generateText` function and its usage remain identical, showcasing the power of the AI SDK's unified API.

This feature allows you to easily experiment with different models, compare their performance, and choose the best one for your specific use case without having to rewrite large portions of your codebase.

## Prompt Engineering and Fine-tuning

While the Llama 3.1 family of models are powerful out-of-the-box, their performance can be enhanced through effective prompt engineering and fine-tuning techniques.

### Prompt Engineering

Prompt engineering is the practice of crafting input prompts to elicit desired outputs from language models. It involves structuring and phrasing prompts in ways that guide the model towards producing more accurate, relevant, and coherent responses.

For more information on prompt engineering techniques (specific to Llama models), check out these resources:

- [Official Llama 3.1 Prompt Guide](https://llama.meta.com/docs/how-to-guides/prompting)
- [Prompt Engineering with Llama 3](https://github.com/amitsangani/Llama/blob/main/Llama_3_Prompt_Engineering.ipynb)
- [How to prompt Llama 3](https://huggingface.co/blog/llama3#how-to-prompt-llama-3)

### Fine-tuning

Fine-tuning involves further training a pre-trained model on a specific dataset or task to customize its performance for particular use cases. This process allows you to adapt Llama 3.1 to your specific domain or application, potentially improving its accuracy and relevance for your needs.

To learn more about fine-tuning Llama models, check out these resources:

- [Official Fine-tuning Llama Guide](https://llama.meta.com/docs/how-to-guides/fine-tuning)
- [Fine-tuning and Inference with Llama 3](https://docs.inferless.com/how-to-guides/how-to-finetune--and-inference-llama3)
- [Fine-tuning Models with Fireworks AI](https://docs.fireworks.ai/fine-tuning/fine-tuning-models)
- [Fine-tuning Llama with Modal](https://modal.com/docs/examples/llm-finetuning)

## Conclusion

The AI SDK offers a powerful and flexible way to integrate cutting-edge AI models like Llama 3.1 into your applications. With AI SDK Core, you can seamlessly switch between different AI models and providers by changing just two lines of code. This flexibility allows for quick experimentation and adaptation, reducing the time required to change models from days to minutes.

The AI SDK ensures that your application remains clean and modular, accelerating development and future-proofing against the rapidly evolving landscape.

Ready to get started? Here's how you can dive in:

1. Explore the documentation at [sdk.vercel.ai/docs](/docs) to understand the full capabilities of the AI SDK.
2. Check out practical examples at [sdk.vercel.ai/examples](/examples) to see the SDK in action and get inspired for your own projects.
3. Dive deeper with advanced guides on topics like Retrieval-Augmented Generation (RAG) and multi-modal chat at [sdk.vercel.ai/docs/guides](/docs/guides).
4. Check out ready-to-deploy AI templates at [vercel.com/templates?type=ai](https://vercel.com/templates?type=ai).

---
title: Get started with OpenAI o1
description: Get started with OpenAI o1 using the AI SDK.
---

# Natural Language Postgres Guide

In this guide, you will learn how to build an app that uses AI to interact with a PostgreSQL database using natural language.

The application will:

- Generate SQL queries from a natural language input
- Explain query components in plain English
- Create a chart to visualise query results

You can find a completed version of this project at [natural-language-postgres.vercel.app](https://natural-language-postgres.vercel.app).

## Project setup

This project uses the following stack:

- [Next.js](https://nextjs.org) (App Router)
- [AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Zod](https://zod.dev)
- [Postgres](https://www.postgresql.org/) with [ Vercel Postgres ](https://vercel.com/postgres)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization

### Clone repo

To focus on the AI-powered functionality rather than project setup and configuration we've prepared a starter repository which includes a database schema and a few components.

Clone the starter repository and check out the `starter` branch:

<Snippet
  text={[
    'git clone https://github.com/vercel-labs/natural-language-postgres',
    'cd natural-language-postgres',
    'git checkout starter',
  ]}
/>

### Project setup and data

Let's set up the project and seed the database with the dataset:

1. Install dependencies:

<Snippet text={['pnpm install']} />

2. Copy the example environment variables file:

<Snippet text={['cp .env.example .env']} />

3. Add your environment variables to `.env`:

```bash filename=".env"
OPENAI_API_KEY="your_api_key_here"
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NO_SSL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

<Note>
  This project uses Vercel Postgres. You can learn more about how to set up at
  the [Vercel Postgres documentation](https://vercel.com/postgres).
</Note>

4. This project uses CB Insights' Unicorn Companies dataset. You can download the dataset by following these instructions:
   - Navigate to [CB Insights Unicorn Companies](https://www.cbinsights.com/research-unicorn-companies)
   - Enter in your email. You will receive a link to download the dataset.
   - Save it as `unicorns.csv` in your project root

### About the dataset

The Unicorn List dataset contains the following information about unicorn startups (companies with a valuation above $1bn):

- Company name
- Valuation
- Date joined (unicorn status)
- Country
- City
- Industry
- Select investors

This dataset contains over 1000 rows of data over 7 columns, giving us plenty of structured data to analyze. This makes it perfect for exploring various SQL queries that can reveal interesting insights about the unicorn startup ecosystem.

5. Now that you have the dataset downloaded and added to your project, you can initialize the database with the following command:

<Snippet text={['pnpm run seed']} />

Note: this step can take a little while. You should see a message indicating the Unicorns table has been created and then that the database has been seeded successfully.

<Note>
  Remember, the dataset should be named `unicorns.csv` and located in root of
  your project.
</Note>

6. Start the development server:

<Snippet text={['pnpm run dev']} />

Your application should now be running at [http://localhost:3000](http://localhost:3000).

## Project structure

The starter repository already includes everything that you will need, including:

- Database seed script (`lib/seed.ts`)
- Basic components built with shadcn/ui (`components/`)
- Function to run SQL queries (`app/actions.ts`)
- Type definitions for the database schema (`lib/types.ts`)

### Existing components

The application contains a single page in `app/page.tsx` that serves as the main interface.

At the top, you'll find a header (`header.tsx`) displaying the application title and description. Below that is an input field and search button (`search.tsx`) where you can enter natural language queries.

Initially, the page shows a collection of suggested example queries (`suggested-queries.tsx`) that you can click to quickly try out the functionality.

When you submit a query:

- The suggested queries section disappears and a loading state appears
- Once complete, a card appears with "TODO - IMPLEMENT ABOVE" (`query-viewer.tsx`) which will eventually show your generated SQL
- Below that is an empty results area with "No results found" (`results.tsx`)

After you implement the core functionality:

- The results section will display data in a table format
- A toggle button will allow switching between table and chart views
- The chart view will visualize your query results

Let's implement the AI-powered functionality to bring it all together.

## Building the application

As a reminder, this application will have three main features:

1. Generate SQL queries from natural language
2. Create a chart from the query results
3. Explain SQL queries in plain English

For each of these features, you'll use the AI SDK via [ Server Actions ](https://react.dev/reference/rsc/server-actions) to interact with OpenAI's GPT-4o and GPT-4o-mini models. Server Actions are a powerful React Server Component feature that allows you to call server-side functions directly from your frontend code.

Let's start with generating a SQL query from natural language.

## Generate SQL queries

### Providing context

For the model to generate accurate SQL queries, it needs context about your database schema, tables, and relationships. You will communicate this information through a prompt that should include:

1. Schema information
2. Example data formats
3. Available SQL operations
4. Best practices for query structure
5. Nuanced advice for specific fields

Let's write a prompt that includes all of this information:

```txt
You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The table schema is as follows:

unicorns (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL UNIQUE,
  valuation DECIMAL(10, 2) NOT NULL,
  date_joined DATE,
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  select_investors TEXT NOT NULL
);

Only retrieval queries are allowed.

For things like industry, company names and other string fields, use the ILIKE operator and convert both the search term and the field to lowercase using LOWER() function. For example: LOWER(industry) ILIKE LOWER('%search_term%').

Note: select_investors is a comma-separated list of investors. Trim whitespace to ensure you're grouping properly. Note, some fields may be null or have only one value.
When answering questions about a specific field, ensure you are selecting the identifying column (ie. what is Vercel's valuation would select company and valuation').

The industries available are:
- healthcare & life sciences
- consumer & retail
- financial services
- enterprise tech
- insurance
- media & entertainment
- industrials
- health

If the user asks for a category that is not in the list, infer based on the list above.

Note: valuation is in billions of dollars so 10b would be 10.0.
Note: if the user asks for a rate, return it as a decimal. For example, 0.1 would be 10%.

If the user asks for 'over time' data, return by year.

When searching for UK or USA, write out United Kingdom or United States respectively.

EVERY QUERY SHOULD RETURN QUANTITATIVE DATA THAT CAN BE PLOTTED ON A CHART! There should always be at least two columns. If the user asks for a single column, return the column and the count of the column. If the user asks for a rate, return the rate as a decimal. For example, 0.1 would be 10%.
```

There are several important elements of this prompt:

- Schema description helps the model understand exactly what data fields to work with
- Includes rules for handling queries based on common SQL patterns - for example, always using ILIKE for case-insensitive string matching
- Explains how to handle edge cases in the dataset, like dealing with the comma-separated investors field and ensuring whitespace is properly handled
- Instead of having the model guess at industry categories, it provides the exact list that exists in the data, helping avoid mismatches
- The prompt helps standardize data transformations - like knowing to interpret "10b" as "10.0" billion dollars, or that rates should be decimal values
- Clear rules ensure the query output will be chart-friendly by always including at least two columns of data that can be plotted

This prompt structure provides a strong foundation for query generation, but you should experiment and iterate based on your specific needs and the model you're using.

### Create a Server Action

With the prompt done, let's create a Server Action.

Open `app/actions.ts`. You should see one action already defined (`runGeneratedSQLQuery`).

Add a new action. This action should be asynchronous and take in one parameter - the natural language query.

```ts filename="app/actions.ts"
/* ...rest of the file... */

export const generateQuery = async (input: string) => {};
```

In this action, you'll use the `generateObject` function from the AI SDK which allows you to constrain the model's output to a pre-defined schema. This process, sometimes called structured output, ensures the model returns only the SQL query without any additional prefixes, explanations, or formatting that would require manual parsing.

```ts filename="app/actions.ts"
/* ...other imports... */
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

/* ...rest of the file... */

export const generateQuery = async (input: string) => {
  'use server';
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      system: `You are a SQL (postgres) ...`, // SYSTEM PROMPT AS ABOVE - OMITTED FOR BREVITY
      prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate query');
  }
};
```

Note, you are constraining the output to a single string field called `query` using `zod`, a TypeScript schema validation library. This will ensure the model only returns the SQL query itself. The resulting generated query will then be returned.

### Update the frontend

With the Server Action in place, you can now update the frontend to call this action when the user submits a natural language query. In the root page (`app/page.tsx`), you should see a `handleSubmit` function that is called when the user submits a query.

Import the `generateQuery` function and call it with the user's input.

```typescript filename="app/page.tsx" highlight="21"
/* ...other imports... */
import { runGeneratedSQLQuery, generateQuery } from './actions';

/* ...rest of the file... */

const handleSubmit = async (suggestion?: string) => {
  clearExistingData();

  const question = suggestion ?? inputValue;
  if (inputValue.length === 0 && !suggestion) return;

  if (question.trim()) {
    setSubmitted(true);
  }

  setLoading(true);
  setLoadingStep(1);
  setActiveQuery('');

  try {
    const query = await generateQuery(question);

    if (query === undefined) {
      toast.error('An error occurred. Please try again.');
      setLoading(false);
      return;
    }

    setActiveQuery(query);
    setLoadingStep(2);

    const companies = await runGeneratedSQLQuery(query);
    const columns = companies.length > 0 ? Object.keys(companies[0]) : [];
    setResults(companies);
    setColumns(columns);

    setLoading(false);
  } catch (e) {
    toast.error('An error occurred. Please try again.');
    setLoading(false);
  }
};

/* ...rest of the file... */
```

Now, when the user submits a natural language query (ie. "how many unicorns are from San Francisco?"), that question will be sent to your newly created Server Action. The Server Action will call the model, passing in your system prompt and the users query, and return the generated SQL query in a structured format. This query is then passed to the `runGeneratedSQLQuery` action to run the query against your database. The results are then saved in local state and displayed to the user.

Save the file, make sure the dev server is running, and then head to `localhost:3000` in your browser. Try submitting a natural language query and see the generated SQL query and results. You should see a SQL query generated and displayed under the input field. You should also see the results of the query displayed in a table below the input field.

Try clicking the SQL query to see the full query if it's too long to display in the input field. You should see a button on the right side of the input field with a question mark icon. Clicking this button currently does nothing, but you'll add the "explain query" functionality to it in the next step.

## Explain SQL Queries

Next, let's add the ability to explain SQL queries in plain English. This feature helps users understand how the generated SQL query works by breaking it down into logical sections.
As with the SQL query generation, you'll need a prompt to guide the model when explaining queries.

Let's craft a prompt for the explain query functionality:

```txt
You are a SQL (postgres) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
unicorns (
  id SERIAL PRIMARY KEY,
  company VARCHAR(255) NOT NULL UNIQUE,
  valuation DECIMAL(10, 2) NOT NULL,
  date_joined DATE,
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  select_investors TEXT NOT NULL
);

When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM unicorns limit 20", the sections could be "SELECT *", "FROM UNICORNS", "LIMIT 20".
If a section doesnt have any explanation, include it, but leave the explanation empty.
```

Like the prompt for generating SQL queries, you provide the model with the schema of the database. Additionally, you provide an example of what each section of the query might look like. This helps the model understand the structure of the query and how to break it down into logical sections.

### Create a Server Action

Add a new Server Action to generate explanations for SQL queries.

This action takes two parameters - the original natural language input and the generated SQL query.

```ts filename="app/actions.ts"
/* ...rest of the file... */

export const explainQuery = async (input: string, sqlQuery: string) => {
  'use server';
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      system: `You are a SQL (postgres) expert. ...`, // SYSTEM PROMPT AS ABOVE - OMITTED FOR BREVITY
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${input}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate query');
  }
};
```

This action uses the `generateObject` function again. However, you haven't defined the schema yet. Let's define it in another file so it can also be used as a type in your components.

Update your `lib/types.ts` file to include the schema for the explanations:

```ts filename="lib/types.ts"
import { z } from 'zod';

/* ...rest of the file... */

export const explanationSchema = z.object({
  section: z.string(),
  explanation: z.string(),
});

export type QueryExplanation = z.infer<typeof explanationSchema>;
```

This schema defines the structure of the explanation that the model will generate. Each explanation will have a `section` and an `explanation`. The `section` is the part of the query being explained, and the `explanation` is the plain English explanation of that section. Go back to your `actions.ts` file and import and use the `explanationSchema`:

```ts filename="app/actions.ts" highlight="2,19,20"
// other imports
import { explanationSchema } from '@/lib/types';

/* ...rest of the file... */

export const explainQuery = async (input: string, sqlQuery: string) => {
  'use server';
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      system: `You are a SQL (postgres) expert. ...`, // SYSTEM PROMPT AS ABOVE - OMITTED FOR BREVITY
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${input}

      Generated SQL Query:
      ${sqlQuery}`,
      schema: explanationSchema,
      output: 'array',
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate query');
  }
};
```

<Note>
  You can use `output: "array"` to indicate to the model that you expect an
  array of objects matching the schema to be returned.
</Note>

### Update query viewer

Next, update the `query-viewer.tsx` component to display these explanations. The `handleExplainQuery` function is called every time the user clicks the question icon button on the right side of the query. Let's update this function to use the new `explainQuery` action:

```ts filename="components/query-viewer.tsx" highlight="2,10,11"
/* ...other imports... */
import { explainQuery } from '@/app/actions';

/* ...rest of the component... */

const handleExplainQuery = async () => {
  setQueryExpanded(true);
  setLoadingExplanation(true);

  const explanations = await explainQuery(inputValue, activeQuery);
  setQueryExplanations(explanations);

  setLoadingExplanation(false);
};

/* ...rest of the component... */
```

Now when users click the explanation button (the question mark icon), the component will:

1. Show a loading state
2. Send the active SQL query and the users natural language query to your Server Action
3. The model will generate an array of explanations
4. The explanations will be set in the component state and rendered in the UI

Submit a new query and then click the explanation button. Hover over different elements of the query. You should see the explanations for each section!

## Visualizing query results

Finally, let's render the query results visually in a chart. There are two approaches you could take:

1. Send both the query and data to the model and ask it to return the data in a visualization-ready format. While this provides complete control over the visualization, it requires the model to send back all of the data, which significantly increases latency and costs.

2. Send the query and data to the model and ask it to generate a chart configuration (fixed-size and not many tokens) that maps your data appropriately. This configuration specifies how to visualize the information while delivering the insights from your natural language query. Importnatly, this is done without requiring the model return the full dataset.

Since you don't know the SQL query or data shape beforehand, let's use the second approach to dynamically generate chart configurations based on the query results and user intent.

### Generate the chart configuration

For this feature, you'll create a Server Action that takes the query results and the user's original natural language query to determine the best visualization approach. Your application is already set up to use `shadcn` charts (which uses [`Recharts`](https://recharts.org/en-US/) under the hood) so the model will need to generate:

- Chart type (bar, line, area, or pie)
- Axis mappings
- Visual styling

Let's start by defining the schema for the chart configuration in `lib/types.ts`:

```ts filename="lib/types.ts"
/* ...rest of the file... */

export const configSchema = z
  .object({
    description: z
      .string()
      .describe(
        'Describe the chart. What is it showing? What is interesting about the way the data is displayed?',
      ),
    takeaway: z.string().describe('What is the main takeaway from the chart?'),
    type: z.enum(['bar', 'line', 'area', 'pie']).describe('Type of chart'),
    title: z.string(),
    xKey: z.string().describe('Key for x-axis or category'),
    yKeys: z
      .array(z.string())
      .describe(
        'Key(s) for y-axis values this is typically the quantitative column',
      ),
    multipleLines: z
      .boolean()
      .describe(
        'For line charts only: whether the chart is comparing groups of data.',
      )
      .optional(),
    measurementColumn: z
      .string()
      .describe(
        'For line charts only: key for quantitative y-axis column to measure against (eg. values, counts etc.)',
      )
      .optional(),
    lineCategories: z
      .array(z.string())
      .describe(
        'For line charts only: Categories used to compare different lines or data series. Each category represents a distinct line in the chart.',
      )
      .optional(),
    colors: z
      .record(
        z.string().describe('Any of the yKeys'),
        z.string().describe('Color value in CSS format (e.g., hex, rgb, hsl)'),
      )
      .describe('Mapping of data keys to color values for chart elements')
      .optional(),
    legend: z.boolean().describe('Whether to show legend'),
  })
  .describe('Chart configuration object');

export type Config = z.infer<typeof configSchema>;
```

<Note>
  Replace the existing `export type Config = any;` type with the new one.
</Note>

This schema makes extensive use of Zod's `.describe()` function to give the model extra context about each of the key's you are expecting in the chart configuration. This will help the model understand the purpose of each key and generate more accurate results.

Another important technique to note here is that you are defining `description` and `takeaway` fields. Not only are these useful for the user to quickly understand what the chart means and what they should take away from it, but they also force the model to generate a description of the data first, before it attempts to generate configuration attributes like axis and columns. This will help the model generate more accurate and relevant chart configurations.

### Create the Server Action

Create a new action in `app/actions.ts`:

```ts
/* ...other imports... */
import { Config, configSchema, explanationsSchema, Result } from '@/lib/types';

/* ...rest of the file... */

export const generateChartConfig = async (
  results: Result[],
  userQuery: string,
) => {
  'use server';

  try {
    const { object: config } = await generateObject({
      model: openai('gpt-4o'),
      system: 'You are a data visualization expert.',
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        colors: {
          sales: "#4CAF50",    // Green for sales
          profit: "#2196F3",   // Blue for profit
          expenses: "#F44336"  // Red for expenses
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(results, null, 2)}`,
      schema: configSchema,
    });

    // Override with shadcn theme colors
    const colors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    const updatedConfig = { ...config, colors };
    return { config: updatedConfig };
  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate chart suggestion');
  }
};
```

### Update the chart component

With the action in place, you'll want to trigger it automatically after receiving query results. This ensures the visualization appears almost immediately after data loads.

Update the `handleSubmit` function in your root page (`app/page.tsx`) to generate and set the chart configuration after running the query:

```typescript filename="app/page.tsx" highlight="38,39"
/* ...other imports... */
import { getCompanies, generateQuery, generateChartConfig } from './actions';

/* ...rest of the file... */
const handleSubmit = async (suggestion?: string) => {
  clearExistingData();

  const question = suggestion ?? inputValue;
  if (inputValue.length === 0 && !suggestion) return;

  if (question.trim()) {
    setSubmitted(true);
  }

  setLoading(true);
  setLoadingStep(1);
  setActiveQuery('');

  try {
    const query = await generateQuery(question);

    if (query === undefined) {
      toast.error('An error occurred. Please try again.');
      setLoading(false);
      return;
    }

    setActiveQuery(query);
    setLoadingStep(2);

    const companies = await runGeneratedSQLQuery(query);
    const columns = companies.length > 0 ? Object.keys(companies[0]) : [];
    setResults(companies);
    setColumns(columns);

    setLoading(false);

    const { config } = await generateChartConfig(companies, question);
    setChartConfig(config);
  } catch (e) {
    toast.error('An error occurred. Please try again.');
    setLoading(false);
  }
};

/* ...rest of the file... */
```

Now when users submit queries, the application will:

1. Generate and run the SQL query
2. Display the table results
3. Generate a chart configuration for the results
4. Allow toggling between table and chart views

Head back to the browser and test the application with a few queries. You should see the chart visualization appear after the table results.

## Next steps

You've built an AI-powered SQL analysis tool that can convert natural language to SQL queries, visualize query results, and explain SQL queries in plain English.

You could, for example, extend the application to use your own data sources or add more advanced features like customizing the chart configuration schema to support more chart types and options. You could also add more complex SQL query generation capabilities.

---
title: Guides
description: Learn how to build AI applications with the AI SDK
---

# Guides

These use-case specific guides are intended to help you build real applications with the AI SDK.

<IndexCards
  cards={[
    {
      title: 'RAG Chatbot',
      description:
        'Learn how to build a retrieval-augmented generation chatbot with the AI SDK.',
      href: '/docs/guides/rag-chatbot',
    },
    {
      title: 'Multimodal Chatbot',
      description: 'Learn how to build a multimodal chatbot with the AI SDK.',
      href: '/docs/guides/multi-modal-chatbot',
    },
    {
      title: 'Get started with Llama 3.1',
      description: 'Get started with Llama 3.1 using the AI SDK.',
      href: '/docs/guides/llama-3_1',
    },
    {
      title: 'Get started with OpenAI o1',
      description: 'Get started with OpenAI o1 using the AI SDK.',
      href: '/docs/guides/o1',
    },
  ]}
/>

---
title: Overview
description: An overview of AI SDK Core.
---

# AI SDK Core

Large Language Models (LLMs) are advanced programs that can understand, create, and engage with human language on a large scale.
They are trained on vast amounts of written material to recognize patterns in language and predict what might come next in a given piece of text.

AI SDK Core **simplifies working with LLMs by offering a standardized way of integrating them into your app** - so you can focus on building great AI applications for your users, not waste time on technical details.

For example, here’s how you can generate text with various models using the AI SDK:

<PreviewSwitchProviders />

## AI SDK Core Functions

AI SDK Core has various functions designed for [text generation](./generating-text), [structured data generation](./generating-structured-data), and [tool usage](./tools-and-tool-calling).
These functions take a standardized approach to setting up [prompts](./prompts) and [settings](./settings), making it easier to work with different models.

- [`generateText`](/docs/ai-sdk-core/generating-text): Generates text and [tool calls](./tools-and-tool-calling).
  This function is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.
- [`streamText`](/docs/ai-sdk-core/generating-text): Stream text and tool calls.
  You can use the `streamText` function for interactive use cases such as [chat bots](/docs/ai-sdk-ui/chatbot) and [content streaming](/docs/ai-sdk-ui/completion).
- [`generateObject`](/docs/ai-sdk-core/generating-structured-data): Generates a typed, structured object that matches a [Zod](https://zod.dev/) schema.
  You can use this function to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.
- [`streamObject`](/docs/ai-sdk-core/generating-structured-data): Stream a structured object that matches a Zod schema.
  You can use this function to [stream generated UIs](/docs/ai-sdk-ui/object-generation).

## API Reference

Please check out the [AI SDK Core API Reference](/docs/reference/ai-sdk-core) for more details on each function.

---
title: Generating Text
description: Learn how to generate text with the AI SDK.
---

# Generating and Streaming Text

Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process.
For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The AI SDK Core provides two functions to generate text and stream it from LLMs:

- [`generateText`](#generatetext): Generates text for a given prompt and model.
- [`streamText`](#streamtext): Streams text from a given prompt and model.

Advanced LLM features such as [tool calling](./tools-and-tool-calling) and [structured data generation](./generating-structured-data) are built on top of text generation.

## `generateText`

You can generate text using the [`generateText`](/docs/reference/ai-sdk-core/generate-text) function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

```tsx
import { generateText } from 'ai';

const { text } = await generateText({
  model: yourModel,
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You can use more [advanced prompts](./prompts) to generate text with more complex instructions and content:

```tsx
import { generateText } from 'ai';

const { text } = await generateText({
  model: yourModel,
  system:
    'You are a professional writer. ' +
    'You write simple, clear, and concise content.',
  prompt: `Summarize the following article in 3-5 sentences: ${article}`,
});
```

The result object of `generateText` contains several promises that resolve when all required data is available:

- `result.text`: The generated text.
- `result.finishReason`: The reason the model finished generating text.
- `result.usage`: The usage of the model during text generation.

## `streamText`

Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating it's response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.

AI SDK Core provides the [`streamText`](/docs/reference/ai-sdk-core/stream-text) function which simplifies streaming text from LLMs:

```ts
import { streamText } from 'ai';

const result = streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
});

// example: use textStream as an async iterable
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

<Note>
  `result.textStream` is both a `ReadableStream` and an `AsyncIterable`.
</Note>

You can use `streamText` on it's own or in combination with [AI SDK
UI](/examples/next-pages/basics/streaming-text-generation) and [AI SDK
RSC](/examples/next-app/basics/streaming-text-generation).
The result object contains several helper functions to make the integration into [AI SDK UI](/docs/ai-sdk-ui) easier:

- `result.toDataStreamResponse()`: Creates a data stream HTTP response (with tool calls etc.) that can be used in a Next.js App Router API route.
- `result.pipeDataStreamToResponse()`: Writes data stream delta output to a Node.js response-like object.
- `result.toTextStreamResponse()`: Creates a simple text stream HTTP response.
- `result.pipeTextStreamToResponse()`: Writes text delta output to a Node.js response-like object.

<Note>
  `streamText` is using backpressure and only generates tokens as they are
  requested. You need to consume the stream in order for it to finish.
</Note>

It also provides several promises that resolve when the stream is finished:

- `result.text`: The generated text.
- `result.finishReason`: The reason the model finished generating text.
- `result.usage`: The usage of the model during text generation.

### `onChunk` callback

When using `streamText`, you can provide an `onChunk` callback that is triggered for each chunk of the stream.

It receives the following chunk types:

- `text-delta`
- `tool-call`
- `tool-result`
- `tool-call-streaming-start` (when `experimental_streamToolCalls` is enabled)
- `tool-call-delta` (when `experimental_streamToolCalls` is enabled)

```tsx highlight="6-11"
import { streamText } from 'ai';

const result = streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    // implement your own logic here, e.g.:
    if (chunk.type === 'text-delta') {
      console.log(chunk.text);
    }
  },
});
```

### `onFinish` callback

When using `streamText`, you can provide an `onFinish` callback that is triggered when the stream is finished (
[API Reference](/docs/reference/ai-sdk-core/stream-text#on-finish)
).
It contains the text, usage information, finish reason, messages, and more:

```tsx highlight="6-8"
import { streamText } from 'ai';

const result = streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, finishReason, usage, response }) {
    // your own logic, e.g. for saving the chat history or recording usage

    const messages = response.messages; // messages that were generated
  },
});
```

### `fullStream` property

You can read a stream with all events using the `fullStream` property.
This can be useful if you want to implement your own UI or handle the stream in a different way.
Here is an example of how to use the `fullStream` property:

```tsx
import { streamText } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: yourModel,
  tools: {
    cityAttractions: {
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => ({
        attractions: ['attraction1', 'attraction2', 'attraction3'],
      }),
    },
  },
  prompt: 'What are some San Francisco tourist attractions?',
});

for await (const part of result.fullStream) {
  switch (part.type) {
    case 'text-delta': {
      // handle text delta here
      break;
    }
    case 'tool-call': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool call here
          break;
        }
      }
      break;
    }
    case 'tool-result': {
      switch (part.toolName) {
        case 'cityAttractions': {
          // handle tool result here
          break;
        }
      }
      break;
    }
    case 'finish': {
      // handle finish here
      break;
    }
    case 'error': {
      // handle error here
      break;
    }
  }
}
```

### Stream transformation

You can use the `experimental_transform` option to transform the stream.
This is useful for e.g. filtering, changing, or smoothing the text stream.

The transformations are applied before the callbacks are invoked and the promises are resolved.
If you e.g. have a transformation that changes all text to uppercase, the `onFinish` callback will receive the transformed text.

#### Smoothing streams

The AI SDK Core provides a [`smoothStream` function](/docs/reference/ai-sdk-core/smooth-stream) that
can be used to smooth out text streaming.

```tsx highlight="6"
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

## Generating Long Text

Most language models have an output limit that is much shorter than their context window.
This means that you cannot generate long text in one go,
but it is possible to add responses back to the input and continue generating
to create longer text.

`generateText` and `streamText` support such continuations for long text generation using the experimental `continueSteps` setting:

```tsx highlight="5-6,9-10"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const {
  text, // combined text
  usage, // combined usage of all steps
} = await generateText({
  model: openai('gpt-4o'), // 4096 output tokens
  maxSteps: 5, // enable multi-step calls
  experimental_continueSteps: true,
  prompt:
    'Write a book about Roman history, ' +
    'from the founding of the city of Rome ' +
    'to the fall of the Western Roman Empire. ' +
    'Each chapter MUST HAVE at least 1000 words.',
});
```

<Note>
  When `experimental_continueSteps` is enabled, only full words are streamed in
  `streamText`, and both `generateText` and `streamText` might drop the trailing
  tokens of some calls to prevent whitespace issues.
</Note>

<Note type="warning">
  Some models might not always stop correctly on their own and keep generating
  until `maxSteps` is reached. You can hint the model to stop by e.g. using a
  system message such as "Stop when sufficient information was provided."
</Note>

## Examples

You can see `generateText` and `streamText` in action using various frameworks in the following examples:

### `generateText`

<ExampleLinks
  examples={[
    {
      title: 'Learn to generate text in Node.js',
      link: '/examples/node/generating-text/generate-text',
    },
    {
      title:
        'Learn to generate text in Next.js with Route Handlers (AI SDK UI)',
      link: '/examples/next-pages/basics/generating-text',
    },
    {
      title:
        'Learn to generate text in Next.js with Server Actions (AI SDK RSC)',
      link: '/examples/next-app/basics/generating-text',
    },
  ]}
/>

### `streamText`

<ExampleLinks
  examples={[
    {
      title: 'Learn to stream text in Node.js',
      link: '/examples/node/generating-text/stream-text',
    },
    {
      title: 'Learn to stream text in Next.js with Route Handlers (AI SDK UI)',
      link: '/examples/next-pages/basics/streaming-text-generation',
    },
    {
      title: 'Learn to stream text in Next.js with Server Actions (AI SDK RSC)',
      link: '/examples/next-app/basics/streaming-text-generation',
    },
  ]}
/>

---
title: Generating Structured Data
description: Learn how to generate structured data with the AI SDK.
---

# Generating Structured Data

While text generation can be useful, your use case will likely call for generating structured data.
For example, you might want to extract information from text, classify data, or generate synthetic data.

Many language models are capable of generating structured data, often defined as using "JSON modes" or "tools".
However, you need to manually provide schemas and then validate the generated data as LLMs can produce incorrect or incomplete structured data.

The AI SDK standardises structured object generation across model providers
with the [`generateObject`](/docs/reference/ai-sdk-core/generate-object)
and [`streamObject`](/docs/reference/ai-sdk-core/stream-object) functions.
You can use both functions with different output strategies, e.g. `array`, `object`, or `no-schema`,
and with different generation modes, e.g. `auto`, `tool`, or `json`.
You can use [Zod schemas](./schemas-and-zod) or [JSON schemas](/docs/reference/ai-sdk-core/json-schema) to specify the shape of the data that you want,
and the AI model will generate data that conforms to that structure.

## Generate Object

The `generateObject` generates structured data from a prompt.
The schema is also used to validate the generated data, ensuring type safety and correctness.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: yourModel,
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

## Stream Object

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case.
With the [`streamObject`](/docs/reference/ai-sdk-core/stream-object) function, you can stream the model's response as it is generated.

```ts
import { streamObject } from 'ai';

const { partialObjectStream } = streamObject({
  // ...
});

// use partialObjectStream as an async iterable
for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

You can use `streamObject` to stream generated UIs in combination with React Server Components (see [Generative UI](../ai-sdk-rsc))) or the [`useObject`](/docs/reference/ai-sdk-ui/use-object) hook.

## Output Strategy

You can use both functions with different output strategies, e.g. `array`, `object`, or `no-schema`.

### Object

The default output strategy is `object`, which returns the generated data as an object.
You don't need to specify the output strategy if you want to use the default.

### Array

If you want to generate an array of objects, you can set the output strategy to `array`.
When you use the `array` output strategy, the schema specifies the shape of an array element.
With `streamObject`, you can also stream the generated array elements using `elementStream`.

```ts highlight="7,18"
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

const { elementStream } = streamObject({
  model: openai('gpt-4-turbo'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});

for await (const hero of elementStream) {
  console.log(hero);
}
```

### Enum

If you want to generate a specific enum value, e.g. for classification tasks,
you can set the output strategy to `enum`
and provide a list of possible values in the `enum` parameter.

<Note>Enum output is only available with `generateObject`.</Note>

```ts highlight="5-6"
import { generateObject } from 'ai';

const { object } = await generateObject({
  model: yourModel,
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt:
    'Classify the genre of this movie plot: ' +
    '"A group of astronauts travel through a wormhole in search of a ' +
    'new habitable planet for humanity."',
});
```

### No Schema

In some cases, you might not want to use a schema,
for example when the data is a dynamic user request.
You can use the `output` setting to set the output format to `no-schema` in those cases
and omit the schema parameter.

```ts highlight="6"
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

## Generation Mode

While some models (like OpenAI) natively support object generation, others require alternative methods, like modified [tool calling](/docs/ai-sdk-core/tools-and-tool-calling). The `generateObject` function allows you to specify the method it will use to return structured data.

- `auto`: The provider will choose the best mode for the model. This recommended mode is used by default.
- `tool`: A tool with the JSON schema as parameters is provided and the provider is instructed to use it.
- `json`: The response format is set to JSON when supported by the provider, e.g. via json modes or grammar-guided generation. If grammar-guided generation is not supported, the JSON schema and instructions to generate JSON that conforms to the schema are injected into the system prompt.

<Note>
  Please note that not every provider supports all generation modes. Some
  providers do not support object generation at all.
</Note>

## Schema Name and Description

You can optionally specify a name and description for the schema. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

```ts highlight="6-7"
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: yourModel,
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

## Error Handling

When `generateObject` cannot generate a valid object, it throws a [`AI_NoObjectGeneratedError`](/docs/reference/ai-sdk-errors/ai-no-object-generated-error).

This error occurs when the AI provider fails to generate a parsable object that conforms to the schema.
It can arise due to the following reasons:

- The model failed to generate a response.
- The model generated a response that could not be parsed.
- The model generated a response that could not be validated against the schema.

The error preserves the following information to help you log the issue:

- `text`: The text that was generated by the model. This can be the raw text or the tool call text, depending on the object generation mode.
- `response`: Metadata about the language model response, including response id, timestamp, and model.
- `usage`: Request token usage.
- `cause`: The cause of the error (e.g. a JSON parsing error). You can use this for more detailed error handling.

```ts
import { generateObject, NoObjectGeneratedError } from 'ai';

try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('NoObjectGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
  }
}
```

## Structured output with `generateText`

<Note type="warning">
  Structured output with `generateText` is experimental and may change in the
  future.
</Note>

You can also generate structured data with `generateText` by using the `experimental_output` setting.
This enables you to use structured outputs together with tool calling (for models that support it - currently only OpenAI).

```ts highlight="1,3,4"
const { experimental_output } = await generateText({
  // ...
  experimental_output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

## More Examples

You can see `generateObject` and `streamObject` in action using various frameworks in the following examples:

### `generateObject`

<ExampleLinks
  examples={[
    {
      title: 'Learn to generate objects in Node.js',
      link: '/examples/node/generating-structured-data/generate-object',
    },
    {
      title:
        'Learn to generate objects in Next.js with Route Handlers (AI SDK UI)',
      link: '/examples/next-pages/basics/generating-object',
    },
    {
      title:
        'Learn to generate objects in Next.js with Server Actions (AI SDK RSC)',
      link: '/examples/next-app/basics/generating-object',
    },
  ]}
/>

### `streamObject`

<ExampleLinks
  examples={[
    {
      title: 'Learn to stream objects in Node.js',
      link: '/examples/node/streaming-structured-data/stream-object',
    },
    {
      title:
        'Learn to stream objects in Next.js with Route Handlers (AI SDK UI)',
      link: '/examples/next-pages/basics/streaming-object-generation',
    },
    {
      title:
        'Learn to stream objects in Next.js with Server Actions (AI SDK RSC)',
      link: '/examples/next-app/basics/streaming-object-generation',
    },
  ]}
/>

---
title: Tool Calling
description: Learn about tool calling and multi-step calls (using maxSteps) with AI SDK Core.
---

# Tool Calling

As covered under Foundations, [tools](/docs/foundations/tools) are objects that can be called by the model to perform a specific task.
AI SDK Core tools contain three elements:

- **`description`**: An optional description of the tool that can influence when the tool is picked.
- **`parameters`**: A [Zod schema](/docs/foundations/tools#schemas) or a [JSON schema](/docs/reference/ai-sdk-core/json-schema) that defines the parameters. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
- **`execute`**: An optional async function that is called with the arguments from the tool call. It produces a value of type `RESULT` (generic type). It is optional because you might want to forward tool calls to the client or to a queue instead of executing them in the same process.

<Note className="mb-2">
  You can use the [`tool`](/docs/reference/ai-sdk-core/tool) helper function to
  infer the types of the `execute` parameters.
</Note>

The `tools` parameter of `generateText` and `streamText` is an object that has the tool names as keys and the tools as values:

```ts highlight="6-17"
import { z } from 'zod';
import { generateText, tool } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

<Note>
  When a model uses a tool, it is called a "tool call" and the output of the
  tool is called a "tool result".
</Note>

Tool calling is not restricted to only text generation.
You can also use it to render user interfaces (Generative UI).

## Multi-Step Calls (using maxSteps)

With the `maxSteps` setting, you can enable multi-step calls in `generateText` and `streamText`. When `maxSteps` is set to a number greater than 1 and the model generates a tool call, the AI SDK will trigger a new generation passing in the tool result until there
are no further tool calls or the maximum number of tool steps is reached.

<Note>
  To decide what value to set for `maxSteps`, consider the most complex task the
  call might handle and the number of sequential steps required for completion,
  rather than just the number of available tools.
</Note>

By default, when you use `generateText` or `streamText`, it triggers a single generation (`maxSteps: 1`). This works well for many use cases where you can rely on the model's training data to generate a response. However, when you provide tools, the model now has the choice to either generate a normal text response, or generate a tool call. If the model generates a tool call, it's generation is complete and that step is finished.

You may want the model to generate text after the tool has been executed, either to summarize the tool results in the context of the users query. In many cases, you may also want the model to use multiple tools in a single response. This is where multi-step calls come in.

You can think of multi-step calls in a similar way to a conversation with a human. When you ask a question, if the person does not have the requisite knowledge in their common knowledge (a model's training data), the person may need to look up information (use a tool) before they can provide you with an answer. In the same way, the model may need to call a tool to get the information it needs to answer your question where each generation (tool call or text generation) is a step.

### Example

In the following example, there are two steps:

1. **Step 1**
   1. The prompt `'What is the weather in San Francisco?'` is sent to the model.
   1. The model generates a tool call.
   1. The tool call is executed.
1. **Step 2**
   1. The tool result is sent to the model.
   1. The model generates a response considering the tool result.

```ts highlight="18"
import { z } from 'zod';
import { generateText, tool } from 'ai';

const { text, steps } = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  maxSteps: 5, // allow up to 5 steps
  prompt: 'What is the weather in San Francisco?',
});
```

<Note>You can use `streamText` in a similar way.</Note>

### Steps

To access intermediate tool calls and results, you can use the `steps` property in the result object
or the `streamText` `onFinish` callback.
It contains all the text, tool calls, tool results, and more from each step.

#### Example: Extract tool results from all steps

```ts highlight="3,9-10"
import { generateText } from 'ai';

const { steps } = await generateText({
  model: openai('gpt-4-turbo'),
  maxSteps: 10,
  // ...
});

// extract all tool calls from the steps:
const allToolCalls = steps.flatMap(step => step.toolCalls);
```

### `onStepFinish` callback

When using `generateText` or `streamText`, you can provide an `onStepFinish` callback that
is triggered when a step is finished,
i.e. all text deltas, tool calls, and tool results for the step are available.
When you have multiple steps, the callback is triggered for each step.

```tsx highlight="5-7"
import { generateText } from 'ai';

const result = await generateText({
  // ...
  onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
    // your own logic, e.g. for saving the chat history or recording usage
  },
});
```

## Response Messages

Adding the generated assistant and tool messages to your conversation history is a common task,
especially if you are using multi-step tool calls.

Both `generateText` and `streamText` have a `responseMessages` property that you can use to
add the assistant and tool messages to your conversation history.
It is also available in the `onFinish` callback of `streamText`.

The `responseMessages` property contains an array of `CoreMessage` objects that you can add to your conversation history:

```ts
import { generateText } from 'ai';

const messages: CoreMessage[] = [
  // ...
];

const { responseMessages } = await generateText({
  // ...
  messages,
});

// add the response messages to your conversation history:
messages.push(...responseMessages); // streamText: ...(await responseMessages)
```

## Tool Choice

You can use the `toolChoice` setting to influence when a tool is selected.
It supports the following settings:

- `auto` (default): the model can choose whether and which tools to call.
- `required`: the model must call a tool. It can choose which tool to call.
- `none`: the model must not call tools
- `{ type: 'tool', toolName: string (typed) }`: the model must call the specified tool

```ts highlight="18"
import { z } from 'zod';
import { generateText, tool } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  toolChoice: 'required', // force the model to call a tool
  prompt: 'What is the weather in San Francisco?',
});
```

## Tool Execution Options

When tools are called, they receive additional options as a second parameter.

### Tool Call ID

The ID of the tool call is forwarded to the tool execution.
You can use it e.g. when sending tool-call related information with stream data.

```ts highlight="14-20"
import { StreamData, streamText, tool } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const data = new StreamData();

  const result = streamText({
    // ...
    messages,
    tools: {
      myTool: tool({
        // ...
        execute: async (args, { toolCallId }) => {
          // return e.g. custom status for tool call
          data.appendMessageAnnotation({
            type: 'tool-status',
            toolCallId,
            status: 'in-progress',
          });
          // ...
        },
      }),
    },
    onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
```

### Messages

The messages that were sent to the language model to initiate the response that contained the tool call are forwarded to the tool execution.
You can access them in the second parameter of the `execute` function.
In multi-step calls, the messages contain the text, tool calls, and tool results from all previous steps.

```ts highlight="8-9"
import { generateText, tool } from 'ai';

const result = await generateText({
  // ...
  tools: {
    myTool: tool({
      // ...
      execute: async (args, { messages }) => {
        // use the message history in e.g. calls to other language models
        return something;
      },
    }),
  },
});
```

### Abort Signals

The abort signals from `generateText` and `streamText` are forwarded to the tool execution.
You can access them in the second parameter of the `execute` function and e.g. abort long-running computations or forward them to fetch calls inside tools.

```ts highlight="6,11,14"
import { z } from 'zod';
import { generateText, tool } from 'ai';

const result = await generateText({
  model: yourModel,
  abortSignal: myAbortSignal, // signal that will be forwarded to tools
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({ location: z.string() }),
      execute: async ({ location }, { abortSignal }) => {
        return fetch(
          `https://api.weatherapi.com/v1/current.json?q=${location}`,
          { signal: abortSignal }, // forward the abort signal to fetch
        );
      },
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Types

Modularizing your code often requires defining types to ensure type safety and reusability.
To enable this, the AI SDK provides several helper types for tools, tool calls, and tool results.

You can use them to strongly type your variables, function parameters, and return types
in parts of the code that are not directly related to `streamText` or `generateText`.

Each tool call is typed with `CoreToolCall<NAME extends string, ARGS>`, depending
on the tool that has been invoked.
Similarly, the tool results are typed with `CoreToolResult<NAME extends string, ARGS, RESULT>`.

The tools in `streamText` and `generateText` are defined as a `Record<string, CoreTool>`.
The type inference helpers `CoreToolCallUnion<TOOLS extends Record<string, CoreTool>>`
and `CoreToolResultUnion<TOOLS extends Record<string, CoreTool>>` can be used to
extract the tool call and tool result types from the tools.

```ts highlight="18-19,23-24"
import { openai } from '@ai-sdk/openai';
import { CoreToolCallUnion, CoreToolResultUnion, generateText, tool } from 'ai';
import { z } from 'zod';

const myToolSet = {
  firstTool: tool({
    description: 'Greets the user',
    parameters: z.object({ name: z.string() }),
    execute: async ({ name }) => `Hello, ${name}!`,
  }),
  secondTool: tool({
    description: 'Tells the user their age',
    parameters: z.object({ age: z.number() }),
    execute: async ({ age }) => `You are ${age} years old!`,
  }),
};

type MyToolCall = CoreToolCallUnion<typeof myToolSet>;
type MyToolResult = CoreToolResultUnion<typeof myToolSet>;

async function generateSomething(prompt: string): Promise<{
  text: string;
  toolCalls: Array<MyToolCall>; // typed tool calls
  toolResults: Array<MyToolResult>; // typed tool results
}> {
  return generateText({
    model: openai('gpt-4o'),
    tools: myToolSet,
    prompt,
  });
}
```

## Handling Errors

The AI SDK has three tool-call related errors:

- [`NoSuchToolError`](/docs/reference/ai-sdk-errors/ai-no-such-tool-error): the model tries to call a tool that is not defined in the tools object
- [`InvalidToolArgumentsError`](/docs/reference/ai-sdk-errors/ai-invalid-tool-arguments-error): the model calls a tool with arguments that do not match the tool's parameters
- [`ToolExecutionError`](/docs/reference/ai-sdk-errors/ai-tool-execution-error): an error that occurred during tool execution
- [`ToolCallRepairError`](/docs/reference/ai-sdk-errors/ai-tool-call-repair-error): an error that occurred during tool call repair

### `generateText`

`generateText` throws errors and can be handled using a `try`/`catch` block:

```ts
try {
  const result = await generateText({
    //...
  });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) {
    // handle the no such tool error
  } else if (InvalidToolArgumentsError.isInstance(error)) {
    // handle the invalid tool arguments error
  } else if (ToolExecutionError.isInstance(error)) {
    // handle the tool execution error
  } else {
    // handle other errors
  }
}
```

### `streamText`

`streamText` sends the errors as part of the full stream. The error parts contain the error object.

When using `toDataStreamResponse`, you can pass an `getErrorMessage` function to extract the error message from the error part and forward it as part of the data stream response:

```ts
const result = streamText({
  // ...
});

return result.toDataStreamResponse({
  getErrorMessage: error => {
    if (NoSuchToolError.isInstance(error)) {
      return 'The model tried to call a unknown tool.';
    } else if (InvalidToolArgumentsError.isInstance(error)) {
      return 'The model called a tool with invalid arguments.';
    } else if (ToolExecutionError.isInstance(error)) {
      return 'An error occurred during tool execution.';
    } else {
      return 'An unknown error occurred.';
    }
  },
});
```

## Tool Call Repair

<Note type="warning">
  The tool call repair feature is experimental and may change in the future.
</Note>

Language models sometimes fail to generate valid tool calls,
especially when the parameters are complex or the model is smaller.

You can use the `experimental_toToolCallRepair` function to attempt to repair the tool call
with a custom function.

You can use different strategies to repair the tool call:

- Use a model with structured outputs to generate the arguments.
- Send the messages, system prompt, and tool schema to a stronger model to generate the arguments.
- Provide more specific repair instructions based on which tool was called.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText, NoSuchToolError, tool } from 'ai';

const result = await generateText({
  model,
  tools,
  prompt,

  // example approach: use a model with structured outputs for repair.
  // (you can use other strategies as well)
  experimental_repairToolCall: async ({
    toolCall,
    tools,
    parameterSchema,
    error,
    messages,
    system,
  }) => {
    if (NoSuchToolError.isInstance(error)) {
      return null; // do not attempt to fix invalid tool names
    }

    const tool = tools[toolCall.toolName as keyof typeof tools];

    const { object: repairedArgs } = await generateObject({
      model: openai('gpt-4o', { structuredOutputs: true }),
      schema: tool.parameters,
      prompt: [
        `The model tried to call the tool "${toolCall.toolName}"` +
          ` with the following arguments:`,
        JSON.stringify(toolCall.args),
        `The tool accepts the following schema:`,
        JSON.stringify(parameterSchema(toolCall)),
        'Please fix the arguments.',
      ].join('\n'),
    });

    return { ...toolCall, args: JSON.stringify(repairedArgs) };
  },
});
```

## Active Tools

<Note type="warning">
  The `activeTools` property is experimental and may change in the future.
</Note>

Language models can only handle a limited number of tools at a time, depending on the model.
To allow for static typing using a large number of tools and limiting the available tools to the model at the same time,
the AI SDK provides the `experimental_activeTools` property.

It is an array of tool names that are currently active.
By default, the value is `undefined` and all tools are active.

```ts highlight="7"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: openai('gpt-4o'),
  tools: myToolSet,
  experimental_activeTools: ['firstTool'],
});
```

## Multi-modal Tool Results

<Note type="warning">
  Multi-modal tool results are experimental and only supported by Anthropic.
</Note>

In order to send multi-modal tool results, e.g. screenshots, back to the model,
they need to be converted into a specific format.

AI SDK Core tools have an optional `experimental_toToolResultContent` function
that converts the tool result into a content part.

Here is an example for converting a screenshot into a content part:

```ts highlight="22-27"
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: {
    computer: anthropic.tools.computer_20241022({
      // ...
      async execute({ action, coordinate, text }) {
        switch (action) {
          case 'screenshot': {
            return {
              type: 'image',
              data: fs
                .readFileSync('./data/screenshot-editor.png')
                .toString('base64'),
            };
          }
          default: {
            return `executed ${action}`;
          }
        }
      },

      // map to tool result content for LLM consumption:
      experimental_toToolResultContent(result) {
        return typeof result === 'string'
          ? [{ type: 'text', text: result }]
          : [{ type: 'image', data: result.data, mimeType: 'image/png' }];
      },
    }),
  },
  // ...
});
```

## Examples

You can see tools in action using various frameworks in the following examples:

<ExampleLinks
  examples={[
    {
      title: 'Learn to use tools in Node.js',
      link: '/examples/node/tools/call-tool',
    },
    {
      title: 'Learn to use tools in Next.js with Route Handlers (AI SDK UI)',
      link: '/examples/next-pages/tools/call-tool',
    },
    {
      title: 'Learn to use tools in Next.js with Server Actions (AI SDK RSC)',
      link: '/examples/next-app/tools/call-tool',
    },
  ]}
/>

---
title: Agents
description: Learn about creating agents with AI SDK Core.
---

# Agents

AI agents let the language model execute a series of steps in a non-deterministic way.
The model can make tool calling decisions based on the context of the conversation, the user's input,
and previous tool calls and results.

One approach to implementing agents is to allow the LLM to choose the next step in a loop.
With `generateText`, you can combine [tools](/docs/ai-sdk-core/tools-and-tool-calling) with `maxSteps`.
This makes it possible to implement agents that reason at each step and make decisions based on the context.

### Example

This example demonstrates how to create an agent that solves math problems.
It has a calculator tool (using [math.js](https://mathjs.org/)) that it can call to evaluate mathematical expressions.

```ts file='main.ts'
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import * as mathjs from 'mathjs';
import { z } from 'zod';

const { text: answer } = await generateText({
  model: openai('gpt-4o-2024-08-06', { structuredOutputs: true }),
  tools: {
    calculate: tool({
      description:
        'A tool for evaluating mathematical expressions. ' +
        'Example expressions: ' +
        "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }) => mathjs.evaluate(expression),
    }),
  },
  maxSteps: 10,
  system:
    'You are solving math problems. ' +
    'Reason step by step. ' +
    'Use the calculator when necessary. ' +
    'When you give the final answer, ' +
    'provide an explanation for how you arrived at it.',
  prompt:
    'A taxi driver earns $9461 per 1-hour of work. ' +
    'If he works 12 hours a day and in 1 hour ' +
    'he uses 12 liters of petrol with a price  of $134 for 1 liter. ' +
    'How much money does he earn in one day?',
});

console.log(`ANSWER: ${answer}`);
```

## Structured Answers

You can use an **answer tool** and the `toolChoice: 'required'` setting to force
the LLM to answer with a structured output that matches the schema of the answer tool.
The answer tool has no `execute` function, so invoking it will terminate the agent.

Alternatively, you can use the [`experimental_output`](/docs/ai-sdk-core/generating-structured-data#structured-output-with-generatetext) setting for `generateText` to generate structured outputs.

### Example

```ts highlight="6,16-29,31,45"
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import 'dotenv/config';
import { z } from 'zod';

const { toolCalls } = await generateText({
  model: openai('gpt-4o-2024-08-06', { structuredOutputs: true }),
  tools: {
    calculate: tool({
      description:
        'A tool for evaluating mathematical expressions. Example expressions: ' +
        "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }) => mathjs.evaluate(expression),
    }),
    // answer tool: the LLM will provide a structured answer
    answer: tool({
      description: 'A tool for providing the final answer.',
      parameters: z.object({
        steps: z.array(
          z.object({
            calculation: z.string(),
            reasoning: z.string(),
          }),
        ),
        answer: z.string(),
      }),
      // no execute function - invoking it will terminate the agent
    }),
  },
  toolChoice: 'required',
  maxSteps: 10,
  system:
    'You are solving math problems. ' +
    'Reason step by step. ' +
    'Use the calculator when necessary. ' +
    'The calculator can only do simple additions, subtractions, multiplications, and divisions. ' +
    'When you give the final answer, provide an explanation for how you got it.',
  prompt:
    'A taxi driver earns $9461 per 1-hour work. ' +
    'If he works 12 hours a day and in 1 hour he uses 14-liters petrol with price $134 for 1-liter. ' +
    'How much money does he earn in one day?',
});

console.log(`FINAL TOOL CALLS: ${JSON.stringify(toolCalls, null, 2)}`);
```

## Accessing all steps

Calling `generateText` with `maxSteps` can result in several calls to the LLM (steps).
You can access information from all steps by using the `steps` property of the response.

```ts highlight="3,9-10"
import { generateText } from 'ai';

const { steps } = await generateText({
  model: openai('gpt-4-turbo'),
  maxSteps: 10,
  // ...
});

// extract all tool calls from the steps:
const allToolCalls = steps.flatMap(step => step.toolCalls);
```

## Getting notified on each completed step

You can use the `onStepFinish` callback to get notified on each completed step.
It is triggered when a step is finished,
i.e. all text deltas, tool calls, and tool results for the step are available.

```tsx highlight="6-8"
import { generateText } from 'ai';

const result = await generateText({
  model: yourModel,
  maxSteps: 10,
  onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
    // your own logic, e.g. for saving the chat history or recording usage
  },
  // ...
});
```

---
title: Prompt Engineering
description: Learn how to develop prompts with AI SDK Core.
---

# Prompt Engineering

## Tips

### Prompts for Tools

When you create prompts that include tools, getting good results can be tricky as the number and complexity of your tools increases.

Here are a few tips to help you get the best results:

1. Use a model that is strong at tool calling, such as `gpt-4` or `gpt-4-turbo`. Weaker models will often struggle to call tools effectively and flawlessly.
1. Keep the number of tools low, e.g. to 5 or less.
1. Keep the complexity of the tool parameters low. Complex Zod schemas with many nested and optional elements, unions, etc. can be challenging for the model to work with.
1. Use semantically meaningful names for your tools, parameters, parameter properties, etc. The more information you pass to the model, the better it can understand what you want.
1. Add `.describe("...")` to your Zod schema properties to give the model hints about what a particular property is for.
1. When the output of a tool might be unclear to the model and there are dependencies between tools, use the `description` field of a tool to provide information about the output of the tool execution.
1. You can include example input/outputs of tool calls in your prompt to help the model understand how to use the tools. Keep in mind that the tools work with JSON objects, so the examples should use JSON.

In general, the goal should be to give the model all information it needs in a clear way.

### Tool & Structured Data Schemas

The mapping from Zod schemas to LLM inputs (typically JSON schema) is not always straightforward, since the mapping is not one-to-one.

#### Zod Dates

Zod expects JavaScript Date objects, but models return dates as strings.
You can specify and validate the date format using `z.string().datetime()` or `z.string().date()`,
and then use a Zod transformer to convert the string to a Date object.

```ts highlight="7-10"
const result = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z
          .string()
          .date()
          .transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the the year 2000.',
});
```

## Debugging

### Inspecting Warnings

Not all providers support all AI SDK features.
Providers either throw exceptions or return warnings when they do not support a feature.
To check if your prompt, tools, and settings are handled correctly by the provider, you can check the call warnings:

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Hello, world!',
});

console.log(result.warnings);
```

### HTTP Request Bodies

You can inspect the raw HTTP request bodies for models that expose them, e.g. [OpenAI](/providers/ai-sdk-providers/openai).
This allows you to inspect the exact payload that is sent to the model provider in the provider-specific way.

Request bodies are available via the `request.body` property of the response:

```ts highlight="6"
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Hello, world!',
});

console.log(result.request.body);
```

---
title: Settings
description: Learn how to configure the AI SDK.
---

# Settings

Large language models (LLMs) typically provide settings to augment their output.

All AI SDK functions support the following common settings in addition to the model, the [prompt](./prompts), and additional provider-specific settings:

```ts highlight="3-5"
const result = await generateText({
  model: yourModel,
  maxTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

<Note>
  Some providers do not support all common settings. If you use a setting with a
  provider that does not support it, a warning will be generated. You can check
  the `warnings` property in the result object to see if any warnings were
  generated.
</Note>

### `maxTokens`

Maximum number of tokens to generate.

### `temperature`

Temperature setting.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means almost deterministic results, and higher values mean more randomness.

It is recommended to set either `temperature` or `topP`, but not both.

### `topP`

Nucleus sampling.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, nucleus sampling is a number between 0 and 1.
E.g. 0.1 would mean that only tokens with the top 10% probability mass are considered.

It is recommended to set either `temperature` or `topP`, but not both.

### `topK`

Only sample from the top K options for each subsequent token.

Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use `temperature`.

### `presencePenalty`

The presence penalty affects the likelihood of the model to repeat information that is already in the prompt.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means no penalty.

### `frequencyPenalty`

The frequency penalty affects the likelihood of the model to repeatedly use the same words or phrases.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, `0` means no penalty.

### `stopSequences`

The stop sequences to use for stopping the text generation.

If set, the model will stop generating text when one of the stop sequences is generated.
Providers may have limits on the number of stop sequences.

### `seed`

It is the seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

### `maxRetries`

Maximum number of retries. Set to 0 to disable retries. Default: `2`.

### `abortSignal`

An optional abort signal that can be used to cancel the call.

The abort signal can e.g. be forwarded from a user interface to cancel the call,
or to define a timeout.

#### Example: Timeout

```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
  abortSignal: AbortSignal.timeout(5000), // 5 seconds
});
```

### `headers`

Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

You can use the request headers to provide additional information to the provider,
depending on what the provider supports. For example, some observability providers support
headers such as `Prompt-Id`.

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
  headers: {
    'Prompt-Id': 'my-prompt-id',
  },
});
```

<Note>
  The `headers` setting is for request-specific headers. You can also set
  `headers` in the provider configuration. These headers will be sent with every
  request made by the provider.
</Note>
