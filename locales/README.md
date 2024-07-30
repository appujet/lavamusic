# 🌍 Multilanguage Support for LavaMusic 🎶

## 🌟 How to Add a New Language

1. 📁 Create a new file in the `locales` directory with the name of the language in the format `language_code.json`. For example, `EnglishUS.json` for English, `SpanishES.json` for Spanish, etc.
2. 📋 Copy the contents of the `EnglishUS.json` file into the new file.
3. 🌐 Translate the strings in the new file to the desired language.


### 📚 Available Translations

- [x] English (US) - `EnglishUS.json` (Default)
- [x] Hindi - `Hindi.json` [by @Appujet](https://github.com/Appujet)
- [x] Spanish (ES) - `SpanishES.json` [by @LucasB25](https://github.com/LucasB25)
- [x] Portuguese (PT) - `PortuguesePT.json` [by @LucasB25](https://github.com/LucasB25)
- [x] Polish - `Polish.json` [by @InfNibor](https://github.com/infnibor) and [by @LucasB25](https://github.com/LucasB25)
- [x] French - `French.json` [by @LucasB25](https://github.com/LucasB25)
- [x] German - `German.json` [by @LucasB25](https://github.com/LucasB25)
- [x] Russian - `Russian.json` [by @LucasB25](https://github.com/LucasB25)
- [ ] Korean - `Korean.json` (In Progress)
- [ ] Indonesian - `Indonesian.json` (Not Started)
- [ ] English (GB) - `EnglishGB.json` (Not Started)
- [ ] Bulgarian - `Bulgarian.json` (Not Started)
- [ ] Chinese (CN) - `ChineseCN.json` (Not Started)
- [ ] Chinese (TW) - `ChineseTW.json` (Not Started)
- [ ] Croatian - `Croatian.json` (Not Started)
- [ ] Czech - `Czech.json` (Not Started)
- [ ] Danish - `Danish.json` (Not Started)
- [ ] Dutch - `Dutch.json` (Not Started)
- [ ] Finnish - `Finnish.json` (Not Started)
- [ ] Greek - `Greek.json` (Not Started)
- [ ] Hungarian - `Hungarian.json` (Not Started)
- [ ] Italian - `Italian.json` (Not Started)
- [x] Japanese - `Japanese.json` [by @hatry4](https://github.com/hatry4)
- [ ] Lithuanian - `Lithuanian.json` (Not Started)
- [ ] Norwegian - `Norwegian.json` (Not Started)
- [ ] Portuguese (BR) - `PortugueseBR.json` (Not Started)
- [ ] Romanian - `Romanian.json` (Not Started)
- [ ] Swedish - `Swedish.json` (Not Started)
- [ ] Thai - `Thai.json` (Not Started)
- [ ] Turkish - `Turkish.json` (Not Started)
- [ ] Ukrainian - `Ukrainian.json` (Not Started)
- [ ] Vietnamese - `Vietnamese.json` (Not Started)


## 📚 How to Use the Translations

1. 📁 Create a new file in the `locales` directory with the name of the language in the format `language_code.json`. For example, `EnglishUS.json` for English, `SpanishES.json` for Spanish, etc.

2. 📋 Copy the contents of the `EnglishUS.json` file into the new file.

3. 🌐 Translate the strings in the new file to the desired language.


## Have a language to contribute? 🎉
- Fork the repository.
- Add the translation file in the `locales` directory.
- Create a pull request with the changes.

## 📝 Translation Guidelines

- **Do not** change the key names in the translation JSON file.
- **Do not** change the structure of the translation JSON file.
- **Do not** remove the `{}` tags from the strings.
- **Do not** add any new keys to the translation JSON file.
- **Do not** add any new directories to the repository.



## 📝 Translation JSON Structure

The translation JSON file should be structured as follows:

```json
{
	"category": {
		"command": {
			"description": "Description of the command.",
			"content": "Command content.",
			"key": "value"
		}
	}
}
```
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
