# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/Allvaa/lava-spotify/compare/v2.2.1...v2.3.0) (2021-06-13)

### ⚠ BREAKING CHANGES

* If the `autoResolve` option disabled `Node#load` will returns a `LavalinkTrackResponse` with `UnresolvedTrack` tracks instead of `LavalinkTrack`, and you will need to resolve it by invoking `UnresolvedTrack#resolve`

### Features

* Added HTTPs support, getNode method, removeNode method ([#13](https://github.com/Allvaa/lava-spotify/issues/13)) ([c5f0bc4](https://github.com/Allvaa/lava-spotify/commit/c5f0bc4a09b1b407c2ac272f1d05f1a5f16438d1))
* autoResolve option ([#14](https://github.com/Allvaa/lava-spotify/issues/14)) ([5038bbc](https://github.com/Allvaa/lava-spotify/commit/5038bbca1a8aa73e6a7e41532180f2dc0b6c0c08))


### [2.2.1](https://github.com/Allvaa/lava-spotify/compare/v2.2.0...v2.2.1) (2021-05-02)


### Bug Fixes

* only load valid playlist tracks ([#10](https://github.com/Allvaa/lava-spotify/issues/10)) ([6dbfed9](https://github.com/Allvaa/lava-spotify/commit/6dbfed97d20219d2e7f29611d459a223457cd253))

## [2.2.0](https://github.com/Allvaa/lava-spotify/compare/v2.1.1...v2.2.0) (2021-04-16)


### ⚠ BREAKING CHANGES

* Renamed some ClientOptions properties<br>
`filterAudioOnlyResult` -> `audioOnlyResults`<br>
`playlistPageLoadLimit` -> `playlistLoadLimit`
* `Node#options` has been removed, all its properties are now merged in the `Node` class

### Features

* Spotify metadata for LavalinkTrack#info ([#8](https://github.com/Allvaa/lava-spotify/issues/8)) ([da26123](https://github.com/Allvaa/lava-spotify/commit/da26123f832ab3a44a56a08a6f2d12fb6cbe5b26))


### Bug Fixes

* **Resolver:** loading some tracks when `audioOnlyResults` enabled returns no matches ([47997fb](https://github.com/Allvaa/lava-spotify/commit/47997fbe2fdcca2ca4e44d2437e39e3791765c6f))
* **Resolver#getTrack:** when no results it's supposed to be an empty array not undefined value in array ([9629d5f](https://github.com/Allvaa/lava-spotify/commit/9629d5f900fb482eb4165c19f4e844b6bf2dd3b9))

### [2.1.2](https://github.com/Allvaa/lava-spotify/compare/v2.1.1...v2.1.2) (2021-02-03)


### Bug Fixes

* files not included ([1e5aa3b](https://github.com/Allvaa/lava-spotify/commit/1e5aa3b2d22e82bd7e376eb992e370d6c13c118d))
* missing typings ([b489039](https://github.com/Allvaa/lava-spotify/commit/b489039815d9feb6fa352e5bb8e1d1b8644222f2))

### [2.1.1](https://github.com/Allvaa/lava-spotify/compare/v2.1.0...v2.1.1) (2021-02-03)


### Bug Fixes

* **Resolver:** prevents cached objects from being modified ([5f57f25](https://github.com/Allvaa/lava-spotify/commit/5f57f25bdae722837b02c9573d9d69073320cfa8))

## [2.1.0](https://github.com/Allvaa/lava-spotify/compare/v2.0.0...v2.1.0) (2021-01-13)


### Features

* **Client:** default options ([717438d](https://github.com/Allvaa/lava-spotify/commit/717438d174181de4143301b21a08d12ebed1d4b3))
* **Resolver:** track caching ([#3](https://github.com/Allvaa/lava-spotify/issues/3)) ([80f56ec](https://github.com/Allvaa/lava-spotify/commit/80f56ec8b50cdaf1d8e689bd10f1444091a4bbdf))
* audio only result ([#2](https://github.com/Allvaa/lava-spotify/issues/2)) ([d464a94](https://github.com/Allvaa/lava-spotify/commit/d464a94f03f7240ca046b85dab53c1e9c305fd98))

## 2.0.0 (2021-01-13)
