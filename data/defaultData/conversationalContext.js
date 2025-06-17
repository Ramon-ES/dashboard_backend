// data/defaultData/conversationalContext.js

export const DEFAULT_CONVERSATION_DATA = {
	context: {
		context: [
			{
				conversationContext: {
					type: "textarea",
					label: "Conversation context",
					placeholder:
						"Give some more context for this specific conversation",
					required: true,
					value: "",
				},
			},
		],
	},
	goal: {
		goal: [
			{
				conversationGoal: {
					type: "textarea",
					label: "Conversation goal",
					placeholder:
						"Describe what you want to achieve with this conversation",
					required: true,
					value: "",
				},
			},
		],
	},
	behaviour: {
		behaviour: [
			{
				conversationBehaviour: {
					type: "textarea",
					label: "Conversation specific behaviour",
					placeholder:
						"Describe the characters behaviour for this specific conversation",
					required: true,
					value: "",
				},
			},
		],
	},
	deletable: true,
};
