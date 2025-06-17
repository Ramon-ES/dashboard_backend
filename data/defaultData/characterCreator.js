// data/defaultData/characterCreation.js

export const DEFAULT_CHARACTER_DATA = {
	persona: {
		background: [
			{
				age: {
					type: "number",
					label: "Age",
					placeholder: "",
					required: true,
					value: "",
					inline: true,
				},
				occupation: {
					type: "text",
					label: "Occupation",
					placeholder: "",
					required: true,
					value: "",
					inline: true,
				},
				gender: {
					type: "select",
					label: "Gender",
					list: ["Male", "Female", "Other"],
					placeholder: "select gender",
					required: true,
					value: "",
					inline: true,
				},
			},
			{
				characterBackground: {
					type: "textarea",
					label: "Character background",
					placeholder:
						"Describe the general background of this character",
					required: true,
					value: "",
				},
			},
		],
		behaviour: [
			{
				characterBehaviour: {
					type: "textarea",
					label: "Character behaviour",
					placeholder:
						"Describe the general behaviour of this character",
					required: true,
					value: "",
				},
			},
		],
	},
	languageAndSpeech: {
		speekingStyle: [
			{
				description: {
					type: "textarea",
					label: "Speaking style",
					placeholder:
						"Describe the general speaking style from this character",
					required: true,
					value: "",
				},
				exampleMonologue: {
					type: "textarea",
					label: "Example monologue",
					placeholder:
						"provide an example monologue from this character",
					required: true,
					value: "",
				},
			},
		],
		voice: [
			{
				characterVoice: {
					type: "select",
					label: "The voice of this character",
					list: ["voiceID1", "voiceID2"],
					placeholder: "select voice",
					required: true,
					value: "",
				},
			},
		],
	},
	personality: {
		presets: [
			{
				personalityPresets: {
					type: "select",
					label: "Personality preset",
					list: ["personality1", "personality2"],
					placeholder: "select personality",
					required: true,
					value: "",
				},
			},
		],
		customisableTraits: [],
	},
	knowledgeBank: {
		fileUpload: [{ comingSoon: {} }],
		plainText: [{ comingSoon: {} }],
	},
	deletable: true,
};
