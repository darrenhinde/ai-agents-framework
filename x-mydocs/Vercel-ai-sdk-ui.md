---
title: Overview
description: An overview of AI SDK UI.
---

# AI SDK UI

AI SDK UI is designed to help you build interactive chat, completion, and assistant applications with ease. It is a **framework-agnostic toolkit**, streamlining the integration of advanced AI functionalities into your applications.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently. With four main hooks — **`useChat`**, **`useCompletion`**, **`useObject`**, and **`useAssistant`** — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

- **[`useChat`](/docs/ai-sdk-ui/chatbot)** offers real-time streaming of chat messages, abstracting state management for inputs, messages, loading, and errors, allowing for seamless integration into any UI design.
- **[`useCompletion`](/docs/ai-sdk-ui/completion)** enables you to handle text completions in your applications, managing the prompt input and automatically updating the UI as new completions are streamed.
- **[`useObject`](/docs/ai-sdk-ui/object-generation)** is a hook that allows you to consume streamed JSON objects, providing a simple way to handle and display structured data in your application.
- **[`useAssistant`](/docs/ai-sdk-ui/openai-assistants)** is designed to facilitate interaction with OpenAI-compatible assistant APIs, managing UI state and updating it automatically as responses are streamed.

These hooks are designed to reduce the complexity and time required to implement AI interactions, letting you focus on creating exceptional user experiences.

## UI Framework Support

AI SDK UI supports the following frameworks: [React](https://react.dev/), [Svelte](https://svelte.dev/), [Vue.js](https://vuejs.org/), and [SolidJS](https://www.solidjs.com/).
Here is a comparison of the supported functions across these frameworks:

| Function                                                  | React               | Svelte              | Vue.js              | SolidJS             |
| --------------------------------------------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| [useChat](/docs/reference/ai-sdk-ui/use-chat)             | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [useChat](/docs/reference/ai-sdk-ui/use-chat) attachments | <Check size={18} /> | <Cross size={18} /> | <Check size={18} /> | <Cross size={18} /> |
| [useCompletion](/docs/reference/ai-sdk-ui/use-completion) | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| [useObject](/docs/reference/ai-sdk-ui/use-object)         | <Check size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Check size={18} /> |
| [useAssistant](/docs/reference/ai-sdk-ui/use-assistant)   | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |

<Note>
  [Contributions](https://github.com/vercel/ai/blob/main/CONTRIBUTING.md) are
  welcome to implement missing features for non-React frameworks.
</Note>

## API Reference

Please check out the [AI SDK UI API Reference](/docs/reference/ai-sdk-ui) for more details on each function.

---
title: Chatbot
description: Learn how to use the useChat hook.
---

# Chatbot

The `useChat` hook makes it effortless to create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive.

To summarize, the `useChat` hook provides the following features:

- **Message Streaming**: All the messages from the AI provider are streamed to the chat UI in real-time.
- **Managed States**: The hook manages the states for input, messages, loading, error and more for you.
- **Seamless Integration**: Easily integrate your chat AI into any design or layout with minimal effort.

In this guide, you will learn how to use the `useChat` hook to create a chatbot application with real-time message streaming.
Check out our [chatbot with tools guide](/docs/ai-sdk-ui/chatbot-with-tool-calling) to learn how to use tools in your chatbot.
Let's start with the following example first.

## Example

```tsx filename='app/page.tsx'
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});

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

```ts filename='app/api/chat/route.ts'
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

In the `Page` component, the `useChat` hook will request to your AI provider endpoint whenever the user submits a message.
The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available,
without having to wait for the entire response to be received.

## Customized UI

`useChat` also provides ways to manage the chat message and input states via code, show loading and error states, and update messages without being triggered by user interactions.

### Loading State

The `isLoading` state returned by the `useChat` hook can be used for several
purposes

- To show a loading spinner while the chatbot is processing the user's message.
- To show a "Stop" button to abort the current message.
- To disable the submit button.

```tsx filename='app/page.tsx' highlight="6,20-27,34"
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({});

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      {isLoading && (
        <div>
          <Spinner />
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

### Error State

Similarly, the `error` state reflects the error object thrown during the fetch request.
It can be used to display an error message, disable the submit button, or show a retry button:

<Note>
  We recommend showing a generic error message to the user, such as "Something
  went wrong." This is a good practice to avoid leaking information from the
  server.
</Note>

```tsx file="app/page.tsx" highlight="6,18-25,31"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({});

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
```

Please also see the [error handling](/docs/ai-sdk-ui/error-handling) guide for more information.

### Modify messages

Sometimes, you may want to directly modify some existing messages. For example, a delete button can be added to each message to allow users to remove them from the chat history.

The `setMessages` function can help you achieve these tasks:

```tsx
const { messages, setMessages, ... } = useChat()

const handleDelete = (id) => {
  setMessages(messages.filter(message => message.id !== id))
}

return <>
  {messages.map(message => (
    <div key={message.id}>
      {message.role === 'user' ? 'User: ' : 'AI: '}
      {message.content}
      <button onClick={() => handleDelete(message.id)}>Delete</button>
    </div>
  ))}
  ...
```

You can think of `messages` and `setMessages` as a pair of `state` and `setState` in React.

### Controlled input

In the initial example, we have `handleSubmit` and `handleInputChange` callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like `setInput` and `append` with your custom input and submit button components:

```tsx
const { input, setInput, append } = useChat()

return <>
  <MyCustomInput value={input} onChange={value => setInput(value)} />
  <MySubmitButton onClick={() => {
    // Send a new message to the AI provider
    append({
      role: 'user',
      content: input,
    })
  }}/>
  ...
```

### Cancelation and regeneration

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the `stop` function returned by the `useChat` hook.

```tsx
const { stop, isLoading, ... } = useChat()

return <>
  <button onClick={stop} disabled={!isLoading}>Stop</button>
  ...
```

When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your chatbot application.

Similarly, you can also request the AI provider to reprocess the last message by calling the `reload` function returned by the `useChat` hook:

```tsx
const { reload, isLoading, ... } = useChat()

return <>
  <button onClick={reload} disabled={isLoading}>Regenerate</button>
  ...
</>
```

When the user clicks the "Regenerate" button, the AI provider will regenerate the last message and replace the current one correspondingly.

### Throttling UI Updates

<Note>This feature is currently only available for React.</Note>

By default, the `useChat` hook will trigger a render every time a new chunk is received.
You can throttle the UI updates with the `experimental_throttle` option.

```tsx filename="page.tsx" highlight="2-3"
const { messages, ... } = useChat({
  // Throttle the messages and data updates to 50ms:
  experimental_throttle: 50
})
```

## Event Callbacks

`useChat` provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle:

- `onFinish`: Called when the assistant message is completed
- `onError`: Called when an error occurs during the fetch request.
- `onResponse`: Called when the response from the API is received.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
import { Message } from 'ai/react';

const {
  /* ... */
} = useChat({
  onFinish: (message, { usage, finishReason }) => {
    console.log('Finished streaming message:', message);
    console.log('Token usage:', usage);
    console.log('Finish reason:', finishReason);
  },
  onError: error => {
    console.error('An error occurred:', error);
  },
  onResponse: response => {
    console.log('Received HTTP response from server:', response);
  },
});
```

It's worth noting that you can abort the processing by throwing an error in the `onResponse` callback. This will trigger the `onError` callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## Request Configuration

### Custom headers, body, and credentials

By default, the `useChat` hook sends a HTTP POST request to the `/api/chat` endpoint with the message list as the request body. You can customize the request by passing additional options to the `useChat` hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/custom-chat',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the `useChat` hook sends a POST request to the `/api/custom-chat` endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.

### Setting custom body fields per request

You can configure custom `body` fields on a per-request basis using the `body` option of the `handleSubmit` function.
This is useful if you want to pass in additional information to your backend that is not part of the message list.

```tsx filename="app/page.tsx" highlight="18-20"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form
        onSubmit={event => {
          handleSubmit(event, {
            body: {
              customKey: 'customValue',
            },
          });
        }}
      >
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

You can retrieve these custom fields on your server side by destructuring the request body:

```ts filename="app/api/chat/route.ts" highlight="3"
export async function POST(req: Request) {
  // Extract addition information ("customKey") from the body of the request:
  const { messages, customKey } = await req.json();
  //...
}
```

## Controlling the response stream

With `streamText`, you can control how error messages and usage information are sent back to the client.

### Error Messages

By default, the error message is masked for security reasons.
The default error message is "An error occurred."
You can forward error messages or send your own error message by providing a `getErrorMessage` function:

```ts filename="app/api/chat/route.ts" highlight="13-27"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse({
    getErrorMessage: error => {
      if (error == null) {
        return 'unknown error';
      }

      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
  });
}
```

### Usage Information

By default, the usage information is sent back to the client. You can disable it by setting the `sendUsage` option to `false`:

```ts filename="app/api/chat/route.ts" highlight="13"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse({
    sendUsage: false,
  });
}
```

### Text Streams

`useChat` can handle plain text streams by setting the `streamProtocol` option to `text`:

```tsx filename="app/page.tsx" highlight="7"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages } = useChat({
    streamProtocol: 'text',
  });

  return <>...</>;
}
```

This configuration also works with other backend servers that stream plain text.
Check out the [stream protocol guide](/docs/ai-sdk-ui/stream-protocol) for more information.

<Note>
  When using `streamProtocol: 'text'`, tool calls, usage information and finish
  reasons are not available.
</Note>

## Empty Submissions

You can configure the `useChat` hook to allow empty submissions by setting the `allowEmptySubmit` option to `true`.

```tsx filename="app/page.tsx" highlight="18"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form
        onSubmit={event => {
          handleSubmit(event, {
            allowEmptySubmit: true,
          });
        }}
      >
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## Attachments (Experimental)

<Note type="warning">
  The attachments feature is currently only available for React and Vue.js.
</Note>

The `useChat` hook supports sending attachments along with a message as well as rendering them on the client. This can be useful for building applications that involve sending images, files, or other media content to the AI provider.

There are two ways to send attachments with a message, either by providing a `FileList` object or a list of URLs to the `handleSubmit` function:

### FileList

By using `FileList`, you can send multiple files as attachments along with a message using the file input element. The `useChat` hook will automatically convert them into data URLs and send them to the AI provider.

<Note>
  Currently, only `image/*` and `text/*` content types get automatically
  converted into [multi-modal content
  parts](https://sdk.vercel.ai/docs/foundations/prompts#multi-modal-messages).
  You will need to handle other content types manually.
</Note>

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>

            <div>
              {message.content}

              <div>
                {message.experimental_attachments
                  ?.filter(attachment =>
                    attachment.contentType.startsWith('image/'),
                  )
                  .map((attachment, index) => (
                    <img
                      key={`${message.id}-${index}`}
                      src={attachment.url}
                      alt={attachment.name}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
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
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

### URLs

You can also send URLs as attachments along with a message. This can be useful for sending links to external resources or media content.

> **Note:** The URL can also be a data URL, which is a base64-encoded string that represents the content of a file. Currently, only `image/*` content types get automatically converted into [multi-modal content parts](https://sdk.vercel.ai/docs/foundations/prompts#multi-modal-messages). You will need to handle other content types manually.

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Attachment } from '@ai-sdk/ui-utils';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();

  const [attachments] = useState<Attachment[]>([
    {
      name: 'earth.png',
      contentType: 'image/png',
      url: 'https://example.com/earth.png',
    },
    {
      name: 'moon.png',
      contentType: 'image/png',
      url: 'data:image/png;base64,iVBORw0KGgo...',
    },
  ]);

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>

            <div>
              {message.content}

              <div>
                {message.experimental_attachments
                  ?.filter(attachment =>
                    attachment.contentType?.startsWith('image/'),
                  )
                  .map((attachment, index) => (
                    <img
                      key={`${message.id}-${index}`}
                      src={attachment.url}
                      alt={attachment.name}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: attachments,
          });
        }}
      >
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

---
title: Chatbot with Tools
description: Learn how to use tools with the useChat hook.
---

# Chatbot with Tools

With [`useChat`](/docs/reference/ai-sdk-ui/use-chat) and [`streamText`](/docs/reference/ai-sdk-core/stream-text), you can use tools in your chatbot application.
The AI SDK supports three types of tools in this context:

1. Automatically executed server-side tools
2. Automatically executed client-side tools
3. Tools that require user interaction, such as confirmation dialogs

The flow is as follows:

1. The user enters a message in the chat UI.
1. The message is sent to the API route.
1. In your server side route, the language model generates tool calls during the `streamText` call.
1. All tool calls are forwarded to the client.
1. Server-side tools are executed using their `execute` method and their results are forwarded to the client.
1. Client-side tools that should be automatically executed are handled with the `onToolCall` callback.
   You can return the tool result from the callback.
1. Client-side tool that require user interactions can be displayed in the UI.
   The tool calls and results are available in the `toolInvocations` property of the last assistant message.
1. When the user interaction is done, `addToolResult` can be used to add the tool result to the chat.
1. When there are tool calls in the last assistant message and all tool results are available, the client sends the updated messages back to the server.
   This triggers another iteration of this flow.

The tool call and tool executions are integrated into the assistant message as `toolInvocations`.
A tool invocation is at first a tool call, and then it becomes a tool result when the tool is executed.
The tool result contains all information about the tool call as well as the result of the tool execution.

<Note>
  In order to automatically send another request to the server when all tool
  calls are server-side, you need to set
  [`maxSteps`](/docs/reference/ai-sdk-ui/use-chat#max-steps) to a value greater
  than 1 in the `useChat` options. It is disabled by default for backward
  compatibility.
</Note>

## Example

In this example, we'll use three tools:

- `getWeatherInformation`: An automatically executed server-side tool that returns the weather in a given city.
- `askForConfirmation`: A user-interaction client-side tool that asks the user for confirmation.
- `getLocation`: An automatically executed client-side tool that returns a random city.

### API route

```tsx filename='app/api/chat/route.ts'
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          'Get the user location. Always ask for confirmation before using this tool.',
        parameters: z.object({}),
      },
    },
  });

  return result.toDataStreamResponse();
}
```

### Client-side page

The client-side page uses the `useChat` hook to create a chatbot application with real-time message streaming.
Tool invocations are displayed in the chat UI.

There are three things worth mentioning:

1. The [`onToolCall`](/docs/reference/ai-sdk-ui/use-chat#on-tool-call) callback is used to handle client-side tools that should be automatically executed.
   In this example, the `getLocation` tool is a client-side tool that returns a random city.

2. The `toolInvocations` property of the last assistant message contains all tool calls and results.
   The client-side tool `askForConfirmation` is displayed in the UI.
   It asks the user for confirmation and displays the result once the user confirms or denies the execution.
   The result is added to the chat using `addToolResult`.

3. The [`maxSteps`](/docs/reference/ai-sdk-ui/use-chat#max-steps) option is set to 5.
   This enables several tool use iterations between the client and the server.

```tsx filename='app/page.tsx' highlight="9,12,31"
'use client';

import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxSteps: 5,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'getLocation') {
          const cities = [
            'New York',
            'Los Angeles',
            'Chicago',
            'San Francisco',
          ];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });

  return (
    <>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          <strong>{m.role}:</strong>
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;
            const addResult = (result: string) =>
              addToolResult({ toolCallId, result });

            // render confirmation tool (client-side tool with user interaction)
            if (toolInvocation.toolName === 'askForConfirmation') {
              return (
                <div key={toolCallId}>
                  {toolInvocation.args.message}
                  <div>
                    {'result' in toolInvocation ? (
                      <b>{toolInvocation.result}</b>
                    ) : (
                      <>
                        <button onClick={() => addResult('Yes')}>Yes</button>
                        <button onClick={() => addResult('No')}>No</button>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            // other tools:
            return 'result' in toolInvocation ? (
              <div key={toolCallId}>
                Tool call {`${toolInvocation.toolName}: `}
                {toolInvocation.result}
              </div>
            ) : (
              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
            );
          })}
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
```

## Tool call streaming

<Note type="warning">This feature is experimental.</Note>

You can stream tool calls while they are being generated by enabling the
`experimental_toolCallStreaming` option in `streamText`.

```tsx filename='app/api/chat/route.ts' highlight="5"
export async function POST(req: Request) {
  // ...

  const result = streamText({
    experimental_toolCallStreaming: true,
    // ...
  });

  return result.toDataStreamResponse();
}
```

When the flag is enabled, partial tool calls will be streamed as part of the data stream.
They are available through the `useChat` hook.
The `toolInvocations` property of assistant messages will also contain partial tool calls.
You can use the `state` property of the tool invocation to render the correct UI.

```tsx filename='app/page.tsx' highlight="9,10"
export default function Chat() {
  // ...
  return (
    <>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            switch (toolInvocation.state) {
              case 'partial-call':
                return <>render partial tool call</>;
              case 'call':
                return <>render full tool call</>;
              case 'result':
                return <>render tool result</>;
            }
          })}
        </div>
      ))}
    </>
  );
}
```

## Server-side Multi-Step Calls

You can also use multi-step calls on the server-side with `streamText`.
This works when all invoked tools have an `execute` function on the server side.

```tsx filename='app/api/chat/route.ts' highlight="15-21,24"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        // tool has execute function:
        execute: async ({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

---
title: Generative User Interfaces
description: Learn how to build Generative UI with AI SDK UI.
---

# Generative User Interfaces

Generative user interfaces (generative UI) is the process of allowing a large language model (LLM) to go beyond text and "generate UI". This creates a more engaging and AI-native experience for users.

<WeatherSearch />

At the core of generative UI are [ tools ](/docs/ai-sdk-core/tools-and-tool-calling), which are functions you provide to the model to perform specialized tasks like getting the weather in a location. The model can decide when and how to use these tools based on the context of the conversation.

Generative UI is the process of connecting the results of a tool call to a React component. Here's how it works:

1. You provide the model with a prompt or conversation history, along with a set of tools.
2. Based on the context, the model may decide to call a tool.
3. If a tool is called, it will execute and return data.
4. This data can then be passed to a React component for rendering.

By passing the tool results to React components, you can create a generative UI experience that's more engaging and adaptive to your needs.

## Build a Generative UI Chat Interface

Let's create a chat interface that handles text-based conversations and incorporates dynamic UI elements based on model responses.

### Basic Chat Implementation

Start with a basic chat implementation using the `useChat` hook:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from 'ai/react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>{message.content}</div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

To handle the chat requests and model responses, set up an API route:

```ts filename="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

This API route uses the `streamText` function to process chat messages and stream the model's responses back to the client.

### Create a Tool

Before enhancing your chat interface with dynamic UI elements, you need to create a tool and corresponding React component. A tool will allow the model to perform a specific action, such as fetching weather information.

Create a new file called `ai/tools.ts` with the following content:

```ts filename="ai/tools.ts"
import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const tools = {
  displayWeather: weatherTool,
};
```

In this file, you've created a tool called `weatherTool`. This tool simulates fetching weather information for a given location. This tool will return simulated data after a 2-second delay. In a real-world application, you would replace this simulation with an actual API call to a weather service.

### Update the API Route

Update the API route to include the tool you've defined:

```ts filename="app/api/chat/route.ts" highlight="3,13"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
```

Now that you've defined the tool and added it to your `streamText` call, let's build a React component to display the weather information it returns.

### Create UI Components

Create a new file called `components/weather.tsx`:

```tsx filename="components/weather.tsx"
type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div>
      <h2>Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};
```

This component will display the weather information for a given location. It takes three props: `temperature`, `weather`, and `location` (exactly what the `weatherTool` returns).

### Render the Weather Component

Now that you have your tool and corresponding React component, let's integrate them into your chat interface. You'll render the Weather component when the model calls the weather tool.

To check if the model has called a tool, you can use the `toolInvocations` property of the message object. This property contains information about any tools that were invoked in that generation including `toolCallId`, `toolName`, `args`, `toolState`, and `result`.

Update your `page.tsx` file:

```tsx filename="app/page.tsx" highlight="4,16-39"
'use client';

import { useChat } from 'ai/react';
import { Weather } from '@/components/weather';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>{message.content}</div>

          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                if (toolName === 'displayWeather') {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

In this updated code snippet, you:

1. Check if the message has `toolInvocations`.
2. Check if the tool invocation state is 'result'.
3. If it's a result and the tool name is 'displayWeather', render the Weather component.
4. If the tool invocation state is not 'result', show a loading message.

This approach allows you to dynamically render UI components based on the model's responses, creating a more interactive and context-aware chat experience.

## Expanding Your Generative UI Application

You can enhance your chat application by adding more tools and components, creating a richer and more versatile user experience. Here's how you can expand your application:

### Adding More Tools

To add more tools, simply define them in your `ai/tools.ts` file:

```ts
// Add a new stock tool
export const stockTool = createTool({
  description: 'Get price for a stock',
  parameters: z.object({
    symbol: z.string().describe('The stock symbol to get the price for'),
  }),
  execute: async function ({ symbol }) {
    // Simulated API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});

// Update the tools object
export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};
```

Now, create a new file called `components/stock.tsx`:

```tsx
type StockProps = {
  price: number;
  symbol: string;
};

export const Stock = ({ price, symbol }: StockProps) => {
  return (
    <div>
      <h2>Stock Information</h2>
      <p>Symbol: {symbol}</p>
      <p>Price: ${price}</p>
    </div>
  );
};
```

Finally, update your `page.tsx` file to include the new Stock component:

```tsx
'use client';

import { useChat } from 'ai/react';
import { Weather } from '@/components/weather';
import { Stock } from '@/components/stock';

export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>

          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === 'result') {
                if (toolName === 'displayWeather') {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                } else if (toolName === 'getStockPrice') {
                  const { result } = toolInvocation;
                  return <Stock key={toolCallId} {...result} />;
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : toolName === 'getStockPrice' ? (
                      <div>Loading stock price...</div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

By following this pattern, you can continue to add more tools and components, expanding the capabilities of your Generative UI application.

---
title: Completion
description: Learn how to use the useCompletion hook.
---

# Completion

The `useCompletion` hook allows you to create a user interface to handle text completions in your application. It enables the streaming of text completions from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

In this guide, you will learn how to use the `useCompletion` hook in your application to generate text completions and stream them in real-time to your users.

## Example

```tsx filename='app/page.tsx'
'use client';

import { useCompletion } from 'ai/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/completion',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="prompt"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts filename='app/api/completion/route.ts'
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    prompt,
  });

  return result.toDataStreamResponse();
}
```

In the `Page` component, the `useCompletion` hook will request to your AI provider endpoint whenever the user submits a message. The completion is then streamed back in real-time and displayed in the UI.

This enables a seamless text completion experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

## Customized UI

`useCompletion` also provides ways to manage the prompt via code, show loading and error states, and update messages without being triggered by user interactions.

### Loading and error states

To show a loading spinner while the chatbot is processing the user's message, you can use the `isLoading` state returned by the `useCompletion` hook:

```tsx
const { isLoading, ... } = useCompletion()

return(
  <>
    {isLoading ? <Spinner /> : null}
  </>
)
```

Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, or show a toast notification:

```tsx
const { error, ... } = useCompletion()

useEffect(() => {
  if (error) {
    toast.error(error.message)
  }
}, [error])

// Or display the error message in the UI:
return (
  <>
    {error ? <div>{error.message}</div> : null}
  </>
)
```

### Controlled input

In the initial example, we have `handleSubmit` and `handleInputChange` callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like `setInput` with your custom input and submit button components:

```tsx
const { input, setInput } = useCompletion();

return (
  <>
    <MyCustomInput value={input} onChange={value => setInput(value)} />
  </>
);
```

### Cancelation

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the `stop` function returned by the `useCompletion` hook.

```tsx
const { stop, isLoading, ... } = useCompletion()

return (
  <>
    <button onClick={stop} disabled={!isLoading}>Stop</button>
  </>
)
```

When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your application.

### Throttling UI Updates

<Note>This feature is currently only available for React.</Note>

By default, the `useCompletion` hook will trigger a render every time a new chunk is received.
You can throttle the UI updates with the `experimental_throttle` option.

```tsx filename="page.tsx" highlight="2-3"
const { completion, ... } = useCompletion({
  // Throttle the completion and data updates to 50ms:
  experimental_throttle: 50
})
```

## Event Callbacks

`useCompletion` also provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle. These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
const { ... } = useCompletion({
  onResponse: (response: Response) => {
    console.log('Received response from server:', response)
  },
  onFinish: (message: Message) => {
    console.log('Finished streaming message:', message)
  },
  onError: (error: Error) => {
    console.error('An error occurred:', error)
  },
})
```

It's worth noting that you can abort the processing by throwing an error in the `onResponse` callback. This will trigger the `onError` callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## Configure Request Options

By default, the `useCompletion` hook sends a HTTP POST request to the `/api/completion` endpoint with the prompt as part of the request body. You can customize the request by passing additional options to the `useCompletion` hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useCompletion({
  api: '/api/custom-completion',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the `useCompletion` hook sends a POST request to the `/api/completion` endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.

---
title: Object Generation
description: Learn how to use the useObject hook.
---

# Object Generation

<Note>`useObject` is an experimental feature and only available in React.</Note>

The [`useObject`](/docs/reference/ai-sdk-ui/use-object) hook allows you to create interfaces that represent a structured JSON object that is being streamed.

In this guide, you will learn how to use the `useObject` hook in your application to generate UIs for structured data on the fly.

## Example

The example shows a small notfications demo app that generates fake notifications in real-time.

### Schema

It is helpful to set up the schema in a separate file that is imported on both the client and server.

```ts filename='app/api/notifications/schema.ts'
import { z } from 'zod';

// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

### Client

The client uses [`useObject`](/docs/reference/ai-sdk-ui/use-object) to stream the object generation process.

The results are partial and are displayed as they are received.
Please note the code for handling `undefined` values in the JSX.

```tsx filename='app/page.tsx'
'use client';

import { experimental_useObject as useObject } from 'ai/react';
import { notificationSchema } from './api/notifications/schema';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

### Server

On the server, we use [`streamObject`](/docs/reference/ai-sdk-core/stream-object) to stream the object generation process.

```typescript filename='app/api/notifications/route.ts'
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamObject({
    model: openai('gpt-4-turbo'),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
}
```

## Customized UI

`useObject` also provides ways to show loading and error states:

### Loading State

The `isLoading` state returned by the `useObject` hook can be used for several
purposes

- To show a loading spinner while the object is generated.
- To show a "Stop" button to abort the current message.
- To disable the submit button.

```tsx filename='app/page.tsx' highlight="6,13-20,24"
'use client';

import { useObject } from 'ai/react';

export default function Page() {
  const { isLoading, stop, object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      {isLoading && (
        <div>
          <Spinner />
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}

      <button
        onClick={() => submit('Messages during finals week.')}
        disabled={isLoading}
      >
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

### Error State

Similarly, the `error` state reflects the error object thrown during the fetch request.
It can be used to display an error message, or to disable the submit button:

<Note>
  We recommend showing a generic error message to the user, such as "Something
  went wrong." This is a good practice to avoid leaking information from the
  server.
</Note>

```tsx file="app/page.tsx" highlight="6,13"
'use client';

import { useObject } from 'ai/react';

export default function Page() {
  const { error, object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      {error && <div>An error occurred.</div>}

      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

## Event Callbacks

`useObject` provides optional event callbacks that you can use to handle life-cycle events.

- `onFinish`: Called when the object generation is completed.
- `onError`: Called when an error occurs during the fetch request.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx filename='app/page.tsx' highlight="10-20"
'use client';

import { experimental_useObject as useObject } from 'ai/react';
import { notificationSchema } from './api/notifications/schema';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
    onFinish({ object, error }) {
      // typed object, undefined if schema validation fails:
      console.log('Object generation completed:', object);

      // error, undefined if schema validation succeeds:
      console.log('Schema validation error:', error);
    },
    onError(error) {
      // error during fetch request:
      console.error('An error occurred:', error);
    },
  });

  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## Configure Request Options

You can configure the API endpoint and optional headers using the `api` and `headers` settings.

```tsx highlight="2-5"
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: {
    'X-Custom-Header': 'CustomValue',
  },
  schema: yourSchema,
});
```

---
title: OpenAI Assistants
description: Learn how to use the useAssistant hook.
---

# OpenAI Assistants

The `useAssistant` hook allows you to handle the client state when interacting with an OpenAI compatible assistant API.
This hook is useful when you want to integrate assistant capabilities into your application,
with the UI updated automatically as the assistant is streaming its execution.

The `useAssistant` hook is supported in `ai/react`, `ai/svelte`, and `ai/vue`.

## Example

```tsx filename='app/page.tsx'
'use client';

import { Message, useAssistant } from 'ai/react';

export default function Chat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: '/api/assistant' });

  return (
    <div>
      {messages.map((m: Message) => (
        <div key={m.id}>
          <strong>{`${m.role}: `}</strong>
          {m.role !== 'data' && m.content}
          {m.role === 'data' && (
            <>
              {(m.data as any).description}
              <br />
              <pre className={'bg-gray-200'}>
                {JSON.stringify(m.data, null, 2)}
              </pre>
            </>
          )}
        </div>
      ))}

      {status === 'in_progress' && <div />}

      <form onSubmit={submitMessage}>
        <input
          disabled={status !== 'awaiting_message'}
          value={input}
          placeholder="What is the temperature in the living room?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

```tsx filename='app/api/assistant/route.ts'
import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error('ASSISTANT_ID is not set');
          })(),
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);

      // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        const tool_outputs =
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);

              switch (toolCall.function.name) {
                // configure your tool calls here

                default:
                  throw new Error(
                    `Unknown tool call function: ${toolCall.function.name}`,
                  );
              }
            },
          );

        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs },
          ),
        );
      }
    },
  );
}
```

## Customized UI

`useAssistant` also provides ways to manage the chat message and input states via code and show loading and error states.

### Loading and error states

To show a loading spinner while the assistant is running the thread, you can use the `status` state returned by the `useAssistant` hook:

```tsx
const { status, ... } = useAssistant()

return(
  <>
    {status === "in_progress" ? <Spinner /> : null}
  </>
)
```

Similarly, the `error` state reflects the error object thrown during the fetch request. It can be used to display an error message, or show a toast notification:

```tsx
const { error, ... } = useAssistant()

useEffect(() => {
  if (error) {
    toast.error(error.message)
  }
}, [error])

// Or display the error message in the UI:
return (
  <>
    {error ? <div>{error.message}</div> : null}
  </>
)
```

### Controlled input

In the initial example, we have `handleSubmit` and `handleInputChange` callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like `append` with your custom input and submit button components:

```tsx
const { append } = useAssistant();

return (
  <>
    <MySubmitButton
      onClick={() => {
        // Send a new message to the AI provider
        append({
          role: 'user',
          content: input,
        });
      }}
    />
  </>
);
```

## Configure Request Options

By default, the `useAssistant` hook sends a HTTP POST request to the `/api/assistant` endpoint with the prompt as part of the request body. You can customize the request by passing additional options to the `useAssistant` hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useAssistant({
  api: '/api/custom-completion',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the `useAssistant` hook sends a POST request to the `/api/custom-completion` endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.

---
title: Storing Messages
description: Welcome to the AI SDK documentation!
---

# Storing Messages

The ability to store message history is essential for chatbot use cases.
The AI SDK simplifies the process of storing chat history through the `onFinish` callback of the `streamText` function.

`onFinish` is called after the model's response and all tool executions have completed.
It provides the final text, tool calls, tool results, and usage information,
making it an ideal place to e.g. store the chat history in a database.

## Implementing Persistent Chat History

To implement persistent chat storage, you can utilize the `onFinish` callback on the `streamText` function.
This callback is triggered upon the completion of the model's response and all tool executions,
making it an ideal place to handle the storage of each interaction.

### API Route Example

```tsx highlight="13-16"
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own storage logic:
      await saveChat({ text, toolCalls, toolResults });
    },
  });

  return result.toDataStreamResponse();
}
```

### Server Action Example

```tsx highlight="10-13"
'use server';

import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';

export async function continueConversation(messages: CoreMessage[]) {
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
    async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      // implement your own storage logic:
      await saveChat({ text, toolCalls, toolResults });
    },
  });

  return result.toDataStreamResponse();
}
```

---
title: Streaming Custom Data
description: Learn how to stream custom data to the client.
---

# Streaming Custom Data

It is often useful to send additional data alongside the model's response.
For example, you may want to send status information, the message ids after storing them,
or references to content that the language model is referring to.

The AI SDK provides several helpers that allows you to stream additional data to the client
and attach it either to the `Message` or to the `data` object of the `useChat` hook:

- `createDataStream`: creates a data stream
- `createDataStreamResponse`: creates a response object that streams data
- `pipeDataStreamToResponse`: pipes a data stream to a server response object

The data is streamed as part of the response stream.

## Sending Custom Data from the Server

In your server-side route handler, you can use `createDataStreamResponse` and `pipeDataStreamToResponse` in combination with `streamText`.
You need to:

1. Call `createDataStreamResponse` or `pipeDataStreamToResponse` to get a callback function with a `DataStreamWriter`.
2. Write to the `DataStreamWriter` to stream additional data.
3. Merge the `streamText` result into the `DataStreamWriter`.
4. Return the response from `createDataStreamResponse` (if that method is used)

Here is an example:

```tsx highlight="7-10,16,19-23,25-26,30"
import { openai } from '@ai-sdk/openai';
import { generateId, createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // immediately start streaming (solves RAG issues with status, etc.)
  return createDataStreamResponse({
    execute: dataStream => {
      dataStream.writeData('initialized call');

      const result = streamText({
        model: openai('gpt-4o'),
        messages,
        onChunk() {
          dataStream.writeMessageAnnotation({ chunk: '123' });
        },
        onFinish() {
          // message annotation:
          dataStream.writeMessageAnnotation({
            id: generateId(), // e.g. id from saved DB record
            other: 'information',
          });

          // call annotation:
          dataStream.writeData('call completed');
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: error => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}
```

<Note>
  You can also send stream data from custom backends, e.g. Python / FastAPI,
  using the [Data Stream
  Protocol](/docs/ai-sdk-ui/stream-protocol#data-stream-protocol).
</Note>

## Processing Custom Data in `useChat`

The `useChat` hook automatically processes the streamed data and makes it available to you.

### Accessing Data

On the client, you can destructure `data` from the `useChat` hook which stores all `StreamData`
as a `JSONValue[]`.

```tsx
import { useChat } from 'ai/react';

const { data } = useChat();
```

### Accessing Message Annotations

Each message from the `useChat` hook has an optional `annotations` property that contains
the message annotations sent from the server.

Since the shape of the annotations depends on what you send from the server,
you have to destructure them in a type-safe way on the client side.

Here we just show the annotations as a JSON string:

```tsx highlight="9"
import { Message, useChat } from 'ai/react';

const { messages } = useChat();

const result = (
  <>
    {messages?.map((m: Message) => (
      <div key={m.id}>
        {m.annotations && <>{JSON.stringify(m.annotations)}</>}
      </div>
    ))}
  </>
);
```

### Updating and Clearing Data

You can update and clear the `data` object of the `useChat` hook using the `setData` function.

```tsx
const { setData } = useChat();

// clear existing data
setData(undefined);

// set new data
setData([{ test: 'value' }]);

// transform existing data, e.g. adding additional values:
setData(currentData => [...currentData, { test: 'value' }]);
```

#### Example: Clear on Submit

```tsx highlight="18-21"
'use client';

import { Message, useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data, setData } =
    useChat();

  return (
    <>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

      {messages?.map((m: Message) => (
        <div key={m.id}>{`${m.role}: ${m.content}`}</div>
      ))}

      <form
        onSubmit={e => {
          setData(undefined); // clear stream data
          handleSubmit(e);
        }}
      >
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
```

---
title: Error Handling
description: Learn how to handle errors in the AI SDK UI
---

# Error Handling

### Error Helper Object

Each AI SDK UI hook also returns an [error](/docs/reference/ai-sdk-ui/use-chat#error) object that you can use to render the error in your UI.
You can use the error object to show an error message, disable the submit button, or show a retry button.

<Note>
  We recommend showing a generic error message to the user, such as "Something
  went wrong." This is a good practice to avoid leaking information from the
  server.
</Note>

```tsx file="app/page.tsx" highlight="7,17-24,30"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({});

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
```

#### Alternative: replace last message

Alternatively you can write a custom submit handler that replaces the last message when an error is present.

```tsx file="app/page.tsx" highlight="15-21,33"
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const {
    handleInputChange,
    handleSubmit,
    error,
    input,
    messages,
    setMesages,
  } = useChat({});

  function customSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (error != null) {
      setMessages(messages.slice(0, -1)); // remove last message
    }

    handleSubmit(event);
  }

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      {error && <div>An error occurred.</div>}

      <form onSubmit={customSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### Error Handling Callback

Errors can be processed by passing an [`onError`](/docs/reference/ai-sdk-ui/use-chat#on-error) callback function as an option to the [`useChat`](/docs/reference/ai-sdk-ui/use-chat), [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion) or [`useAssistant`](/docs/reference/ai-sdk-ui/use-assistant) hooks.
The callback function receives an error object as an argument.

```tsx file="app/page.tsx" highlight="8-11"
import { useChat } from 'ai/react';

export default function Page() {
  const {
    /* ... */
  } = useChat({
    // handle error:
    onError: error => {
      console.error(error);
    },
  });
}
```

### Injecting Errors for Testing

You might want to create errors for testing.
You can easily do so by throwing an error in your route handler:

```ts file="app/api/chat/route.ts"
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```

---
title: Stream Protocols
description: Learn more about the supported stream protocols in the AI SDK.
---

# Stream Protocols

AI SDK UI functions such as `useChat` and `useCompletion` support both text streams and data streams.
The stream protocol defines how the data is streamed to the frontend on top of the HTTP protocol.

This page describes both protocols and how to use them in the backend and frontend.

You can use this information to develop custom backends and frontends for your use case, e.g.,
to provide compatible API endpoints that are implemented in a different language such as Python.

For instance, here's an example using [FastAPI](https://github.com/vercel/ai/tree/main/examples/next-fastapi) as a backend.

## Text Stream Protocol

A text stream contains chunks in plain text, that are streamed to the frontend.
Each chunk is then appended together to form a full text response.

Text streams are supported by `useChat`, `useCompletion`, and `useObject`.
When you use `useChat` or `useCompletion`, you need to enable text streaming
by setting the `streamProtocol` options to `text`.

You can generate text streams with `streamText` in the backend.
When you call `toTextStreamResponse()` on the result object,
a streaming HTTP response is returned.

<Note>
  Text streams only support basic text data. If you need to stream other types
  of data such as tool calls, use data streams.
</Note>

### Text Stream Example

Here is a Next.js example that uses the text stream protocol:

```tsx filename='app/page.tsx' highlight="7"
'use client';

import { useCompletion } from 'ai/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    streamProtocol: 'text',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts filename='app/api/completion/route.ts' highlight="15"
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    prompt,
  });

  return result.toTextStreamResponse();
}
```

## Data Stream Protocol

A data stream follows a special protocol that the AI SDK provides to send information to the frontend.

Each stream part has the format `TYPE_ID:CONTENT_JSON\n`.

<MDXImage
  srcLight="/images/data-stream-protocol.png"
  srcDark="/images/data-stream-protocol.png"
  width={3200}
  height={1712}
/>

<Note>
  When you provide data streams from a custom backend, you need to set the
  `x-vercel-ai-data-stream` header to `v1`.
</Note>

The following stream parts are currently supported:

### Text Part

The text parts are appended to the message as they are received.

Format: `0:string\n`

Example: `0:"example"\n`

<MDXImage
  srcLight="/images/text-part.png"
  srcDark="/images/text-part.png"
  width={3200}
  height={1148}
/>

### Data Part

The data parts are parsed as JSON and appended to the message as they are received. The data part is available through `data`.

Format: `2:Array<JSONValue>\n`

Example: `2:[{"key":"object1"},{"anotherKey":"object2"}]\n`

<MDXImage
  srcLight="/images/data-part.png"
  srcDark="/images/data-part.png"
  width={3200}
  height={1148}
/>

### Message Annotation Part

The message annotation parts are appended to the message as they are received. The annotation part is available through `annotations`.

Format: `8:Array<JSONValue>\n`

Example: `8:[{"id":"message-123","other":"annotation"}]\n`

### Error Part

The error parts are appended to the message as they are received.

Format: `3:string\n`

Example: `3:"error message"\n`

<MDXImage
  srcLight="/images/error-part.png"
  srcDark="/images/error-part.png"
  width={3200}
  height={1148}
/>

### Tool Call Streaming Start Part

A part indicating the start of a streaming tool call. This part needs to be sent before any tool call delta for that tool call. Tool call streaming is optional, you can use tool call and tool result parts without it.

Format: `b:{toolCallId:string; toolName:string}\n`

Example: `b:{"toolCallId":"call-456","toolName":"streaming-tool"}\n`

<MDXImage
  srcLight="/images/tool-call-streaming-start-part.png"
  srcDark="/images/tool-call-streaming-start-part.png"
  width={3200}
  height={1148}
/>

### Tool Call Delta Part

A part representing a delta update for a streaming tool call.

Format: `c:{toolCallId:string; argsTextDelta:string}\n`

Example: `c:{"toolCallId":"call-456","argsTextDelta":"partial arg"}\n`

<MDXImage
  srcLight="/images/tool-call-delta-part.png"
  srcDark="/images/tool-call-delta-part.png"
  width={3200}
  height={1148}
/>

### Tool Call Part

A part representing a tool call. When there are streamed tool calls, the tool call part needs to come after the tool call streaming is finished.

Format: `9:{toolCallId:string; toolName:string; args:object}\n`

Example: `9:{"toolCallId":"call-123","toolName":"my-tool","args":{"some":"argument"}}\n`

<MDXImage
  srcLight="/images/tool-call-part.png"
  srcDark="/images/tool-call-part.png"
  width={3200}
  height={1148}
/>

### Tool Result Part

A part representing a tool result. The result part needs to be sent after the tool call part for that tool call.

Format: `a:{toolCallId:string; result:object}\n`

Example: `a:{"toolCallId":"call-123","result":"tool output"}\n`

<MDXImage
  srcLight="/images/tool-result-part.png"
  srcDark="/images/tool-result-part.png"
  width={3200}
  height={1148}
/>

### Finish Step Part

A part indicating that a step (i.e., one LLM API call in the backend) has been completed.

This part is necessary to correctly process multiple stitched assistant calls, e.g. when calling tools in the backend, and using steps in `useChat` at the same time.

It includes the following metadata:

- [`FinishReason`](/docs/reference/ai-sdk-ui/use-chat#on-finish-finish-reason)
- [`Usage`](/docs/reference/ai-sdk-ui/use-chat#on-finish-usage) for that step.
- `isContinued` to indicate if the step text will be continued in the next step.

The finish step part needs to come at the end of a step.

Format: `e:{finishReason:'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';usage:{promptTokens:number; completionTokens:number;},isContinued:boolean}\n`

Example: `e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20},"isContinued":false}\n`

### Finish Message Part

A part indicating the completion of a message with additional metadata, such as [`FinishReason`](/docs/reference/ai-sdk-ui/use-chat#on-finish-finish-reason) and [`Usage`](/docs/reference/ai-sdk-ui/use-chat#on-finish-usage). This part needs to be the last part in the stream.

Format: `d:{finishReason:'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';usage:{promptTokens:number; completionTokens:number;}}\n`

Example: `d:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20}}\n`

<MDXImage
  srcLight="/images/finish-message-part.png"
  srcDark="/images/finish-message-part.png"
  width={3200}
  height={1148}
/>

The data stream protocol is supported
by `useChat` and `useCompletion` on the frontend and used by default.
`useCompletion` only supports the `text` and `data` stream parts.

On the backend, you can use `toDataStreamResponse()` from the `streamText` result object to return a streaming HTTP response.

### Data Stream Example

Here is a Next.js example that uses the data stream protocol:

```tsx filename='app/page.tsx' highlight="7"
'use client';

import { useCompletion } from 'ai/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    streamProtocol: 'data', // optional, this is the default
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts filename='app/api/completion/route.ts' highlight="15"
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    prompt,
  });

  return result.toDataStreamResponse();
}
```

---
title: AI SDK UI
description: Learn about the AI SDK UI.
---

# AI SDK UI

<IndexCards
  cards={[
    {
      title: 'Overview',
      description: 'Get an overview about the AI SDK UI.',
      href: '/docs/ai-sdk-ui/overview',
    },
    {
      title: 'Chatbot',
      description: 'Learn how to integrate an interface for a chatbot.',
      href: '/docs/ai-sdk-ui/chatbot',
    },
    {
      title: 'Chatbot with tool calling',
      description:
        'Learn how to integrate an interface for a chatbot with tool calling.',
      href: '/docs/ai-sdk-ui/chatbot-with-tool-calling',
    },
    {
      title: 'Completion',
      description: 'Learn how to integrate an interface for text completion.',
      href: '/docs/ai-sdk-ui/completion',
    },
    {
      title: 'Object Generation',
      description: 'Learn how to integrate an interface for object generation.',
      href: '/docs/ai-sdk-ui/object-generation',
    },
    {
      title: 'OpenAI Assistants',
      description: 'Learn how to integrate an interface for OpenAI Assistants.',
      href: '/docs/ai-sdk-ui/openai-assistants',
    },
    {
      title: 'Storing Messages',
      description: 'Learn how to store messages.',
      href: '/docs/ai-sdk-ui/storing-messages',
    },
    {
      title: 'Streaming Data',
      description: 'Learn how to stream data.',
      href: '/docs/ai-sdk-ui/streaming-data',
    },
    {
      title: 'Error Handling',
      description: 'Learn how to handle errors.',
      href: '/docs/ai-sdk-ui/error-handling',
    },
    {
      title: 'Stream Protocol',
      description:
        'The stream protocol defines how data is sent from the backend to the AI SDK UI frontend.',
      href: '/docs/ai-sdk-ui/stream-protocol',
    },
  ]}
/>
