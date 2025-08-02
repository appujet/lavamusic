export enum SearchEngine {
	YouTube = "ytsearch",
	YouTubeMusic = "ytmsearch",
	Spotify = "spsearch",
	Deezer = "dzsearch",
	Apple = "amsearch",
	SoundCloud = "scsearch",
	Yandex = "ymsearch",
	JioSaavn = "jssearch",
}

export enum Language {
	// Bulgarian = "Bulgarian",
	ChineseCN = "ChineseCN",
	ChineseTW = "ChineseTW",
	// Croatian = "Croatian",
	// Czech = "Czech",
	// Danish = "Danish",
	// Dutch = "Dutch",
	// EnglishGB = "EnglishGB",
	EnglishUS = "EnglishUS",
	// Finnish = "Finnish",
	French = "French",
	German = "German",
	// Greek = "Greek",
	Hindi = "Hindi",
	// Hungarian = "Hungarian",
	Indonesian = "Indonesian",
	// Italian = "Italian",
	Japanese = "Japanese",
	Korean = "Korean",
	// Lithuanian = "Lithuanian",
	Norwegian = "Norwegian",
	Polish = "Polish",
	// PortugueseBR = "PortugueseBR",
	// Romanian = "Romanian",
	Russian = "Russian",
	SpanishES = "SpanishES",
	// Swedish = "Swedish",
	// Thai = "Thai",
	Turkish = "Turkish",
	// Ukrainian = "Ukrainian",
	Vietnamese = "Vietnamese",
}
export const LocaleFlags = {
	// [Language.Bulgarian]: "🇧🇬",
	[Language.ChineseCN]: "🇨🇳",
	[Language.ChineseTW]: "🇹🇼",
	// [Language.Croatian]: "🇭🇷",
	// [Language.Czech]: "🇨🇿",
	// [Language.Danish]: "🇩🇰",
	// [Language.Dutch]: "🇳🇱",
	// [Language.EnglishGB]: "🇬🇧",
	[Language.EnglishUS]: "🇺🇸",
	// [Language.Finnish]: "🇫🇮",
	[Language.French]: "🇫🇷",
	[Language.German]: "🇩🇪",
	// [Language.Greek]: "🇬🇷",
	[Language.Hindi]: "🇮🇳",
	// [Language.Hungarian]: "🇭🇺",
	[Language.Indonesian]: "🇮🇩",
	// [Language.Italian]: "🇮🇹",
	[Language.Japanese]: "🇯🇵",
	[Language.Korean]: "🇰🇷",
	// [Language.Lithuanian]: "🇱🇹",
	[Language.Norwegian]: "🇳🇴",
	[Language.Polish]: "🇵🇱",
	// [Language.PortugueseBR]: "🇧🇷",
	// [Language.Romanian]: "🇷🇴",
	[Language.Russian]: "🇷🇺",
	[Language.SpanishES]: "🇪🇸",
	// [Language.Swedish]: "🇸🇪",
	// [Language.Thai]: "🇹🇭",
	[Language.Turkish]: "🇹🇷",
	// [Language.Ukrainian]: "🇺🇦",
	[Language.Vietnamese]: "🇻🇳",
};

export interface Requester {
	id: string;
	username: string;
	discriminator?: string;
	avatarURL?: string;
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
