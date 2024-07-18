# 🌍 Multilanguage Support for LavaMusic 🎶

## 🌟 How to Add a New Language

1. 📁 Create a new file in the `locales` directory with the name of the language in the format `language_code.json`. For example, `EnglishUS.json` for English, `SpanishES.json` for Spanish, etc.
2. 📋 Copy the contents of the `EnglishUS.json` file into the new file.
3. 🌐 Translate the strings in the new file to the desired language.

### Example Translation JSON

**EnglishUS:**
```json
{
	"cmd": {
		"ping": {
			"description": "Shows the bot's ping.",
			"content": "Pinging...",
			"bot_latency": "Bot Latency",
			"api_latency": "API Latency",
			"requested_by": "Requested by {author}"
		}
	}
}
```

**Hindi:**
```json
{
	"cmd": {
		"ping": {
			"description": "बॉट का पिंग दिखाता है।",
			"content": "पिंगिंग...",
			"bot_latency": "पिंगिंग...",
			"api_latency": "एपीआई लेटेंसी",
			"requested_by": "{author} द्वारा अनुरोधित"
		}
	}
}
```

### Formatting Tags for i18n NPM
To ensure `{}` are not removed during translations, use the format tags: `["{", "}"]`.


## 📚 Resources
- [i18n NPM](https://www.npmjs.com/package/i18n)
- [Discord Developer Portal - Locales](https://discord.com/developers/docs/reference#locales)
