import { ChatAnthropicTools } from "@langchain/anthropic/experimental";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatAnthropicTools({
  temperature: 0.1,
  modelName: "claude-3-sonnet-20240229",
}).bind({
  tools: [
    {
      type: "function",
      function: {
        name: "get_current_weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA",
            },
            unit: { type: "string", enum: ["celsius", "fahrenheit"] },
          },
          required: ["location"],
        },
      },
    },
  ],
  // You can set the `function_call` arg to force the model to use a function
  tool_choice: {
    type: "function",
    function: {
      name: "get_current_weather",
    },
  },
});

const response = await model.invoke([
  new HumanMessage({
    content: "What's the weather in Boston?",
  }),
]);

console.log(response);

/*
  AIMessage {
    lc_serializable: true,
    lc_kwargs: { content: '', additional_kwargs: { tool_calls: [Array] } },
    lc_namespace: [ 'langchain_core', 'messages' ],
    content: '',
    name: undefined,
    additional_kwargs: { tool_calls: [ [Object] ] }
  }
*/

console.log(response.additional_kwargs.tool_calls);

/*
  [
    {
      id: '0',
      type: 'function',
      function: {
        name: 'get_current_weather',
        arguments: '{"location":"Boston, MA","unit":"fahrenheit"}'
      }
    }
  ]
*/
