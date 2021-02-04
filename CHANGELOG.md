# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.3.2](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v2.3.1...v2.3.2) (2021-01-22)

### [2.3.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v2.3.0...v2.3.1) (2021-01-22)

## [2.3.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v2.2.1...v2.3.0) (2021-01-22)


### Features

* 🎸 change text label and add hint for registrations ([0e7e9a8](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/0e7e9a8a6cc895a3482d2e8dc821673f68f57284))

### [2.2.1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v2.2.0...v2.2.1) (2021-01-12)


### Bug Fixes

* 🐛 replace xlsx icon to fix fill problem ([4eb6dff](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4eb6dff18588a8d30fad76b7fe08b9ea3476a73e))
* 🐛 route redirect after feedback filter change ([b5a66d4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b5a66d494b1a3afd7649a31eebf606d245a73dab))

## [2.2.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v2.1.0...v2.2.0) (2021-01-11)


### Features

* 🎸 added new ct 20 (men) and registration page ([573e7fc](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/573e7fc701c35e8fe37353bfbde4930a463f49a3))
* 🎸 added SelectedAgencyInfo component and translations ([f46edbd](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f46edbde467b4149669830bc91b5dca1672789d4))
* 🎸 changing styles for selectedAgencyInfo overline ([31b00c9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/31b00c9d01187e6cc6ac4bccc1d1f5dd43891c81))
* 🎸 deactivate registration to ct 20 ([3b0d155](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/3b0d155a3ff3aa2df4d83554c2df3415eeceba71))
* 🎸 new postcode validation & registration logic, cleanup ([9162f3e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9162f3e752943211a0f8bf7e085a0ad8f4391c14))
* 🎸 new special char validation for passwords ([505709e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/505709e5ef61f7297ba5b045e8b8c3aa54fd9080))
* 🎸 refactor agencySelection for new postcode validation ([835ab0d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/835ab0d72274c0e159f7e763e03d2e3ced6af996))
* generate types from openapi service yaml urls ([5480c3c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/5480c3c7f43529a6f3de29de0b889880b55e8a49))
* **session-list:** offset fetch when scroll threshold is reached ([e89ec20](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e89ec207040c8a25ed9f58755cfe749fbd045d95))


### Bug Fixes

* **sessions-list:** logout if trying to paginate with expired access token ([5d43723](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/5d4372348cf6c1451942e9f5b00d87a8d1a7266c))
* 🐛 checkbox icon fix for peer user ([a3d22f4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a3d22f4d2a9f82834f30ee7e4c6afa17ab9ddecd))
* 🐛 content wrapper header spacing ([212375e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/212375efbcc4be62d0d5b50e548eaf5034f5da39))
* 🐛 feedback tag link ([4c98a44](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4c98a448da7f3a23098d6c3c52ca432380b6a56a))
* 🐛 postcode fix for asker registration ([ad70e8e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/ad70e8e25818d15c2d74cc0f6a1914f542a5c03c))
* 🐛 session list headline alignement ([39aca57](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/39aca5799b33495e39974299761c92f0e4eb51a7))
* 🐛 session list spacing on mobile ([7d0fef4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/7d0fef46178785e6c8362fdec333de0a18ac48d7))
* 🐛 small styling adjustments out of design QS ([21e98b8](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/21e98b8938d702e1373aa52be63c30f3ebdd03b4))
* 🐛 validation for prefilled agencies, cleanup deprecated ([7215d45](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/7215d45eeff22851d78d0b29dcdb85994468080f))

## [2.1.0](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/compare/v1.3.1...v2.1.0) (2020-12-14)


### Features

* 🎸 add all components to registration for generic cases ([c5be879](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/c5be879654b091e8384bc03838482a86bdf4992b))
* 🎸 add debounce on scroll container scroll event ([2ff724e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2ff724e607132f8b076fc9a5e12889ad95179184))
* 🎸 add malteser logo to stage ([7fd94a5](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/7fd94a51e088e3a6dae0af3420b89444f4bedc76))
* 🎸 add offender to longpostcodevalidation ([2816614](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2816614e6d510ad5389c81ede68efd74b6521218))
* 🎸 add password reset in u25 and united registration ([720c147](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/720c14710a68063907bf31efa35a3087096cffc2))
* 🎸 add red badge to button ([123a7be](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/123a7bec10c8d3a9045ae28cbdd531cf35f35f0d))
* 🎸 add registration react component ([27bbe25](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/27bbe251897a23f0eb9f4a6b9f849600dbc79d43))
* 🎸 add scroll to bottom button in session item ([85d0413](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/85d041325362f6169c77022a0747ac2215d4836a))
* 🎸 add submit button to registration ([d9a7328](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d9a73286e6922e1d14033b52dd20ae224e08417c))
* 🎸 add unread message count, divider and scroll behavior ([3c75a9f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/3c75a9f97e4e92edf799d418595105f0f0f3552c))
* 🎸 added draftMessage saving & loading feature ([b0b4cfb](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b0b4cfbe7c47f122d46cb68a60c510b92f1778e5))
* 🎸 adjust password info text in profile and registration ([81bacca](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/81baccac1066030e7e173f1f543bf249eb2224cc))
* 🎸 adjust special character regex for password input ([e1a5770](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e1a5770d03f8586080a11decc224212109a599de))
* 🎸 implemented liveservice to cra app ([25e9554](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/25e95549dd60274d141934ae5968bc62d81f9d03))
* 🎸 import consulting type and registration data ([082de4e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/082de4e2da99a75eac9b582095d190c3535aa3a9))
* 🎸 migrate error page to react ([78c0f6f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/78c0f6fb7806a37266c9a3bf7bd9f31c4d5cd991))
* 🎸 new registration for all cts, texts, style fix ([d1f866d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d1f866d9ca276238cd04a69c9abef777291eb0de))
* 🎸 no scroll to bottom on new messages ([939c7fe](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/939c7fe01a8b01cde09d39a6c73c50f7da2c8de6))
* 🎸 refactor overlay to be used with react icon component ([b2ac934](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b2ac9349ac3f3bf5867390ba7d21560ef4fbcd19))
* 🎸 register to and from kreuzbund, style changes ([0836508](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/083650893f8b3848175d79b0ad1587b0bf29e510))
* 🎸 scroll on new message if already at bottom of container ([18120a1](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/18120a1cb17d40e896f2d947acd32b821cd8ad4c))
* 🎸 show "99+" if unread messages > 99 ([83cc00e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/83cc00e7a05fd14a912f0fd0f27b792a016d9d51))
* **polyfill:** ie 11 support ([cac00ed](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/cac00ed0096b515ddc21c75dc3baf3355ec2bf83))
* **tests:** add cypress and mocked login test ([23d3464](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/23d346449fdaf09d055778122412753bc2de2b32))
* 🎸 validate required registration input fields ([fb660b9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/fb660b91d0dcce4370c0ab6c36731e94758e042e))
* informal text for upload quota error ([86c8671](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/86c86711747099fc06a14f6df7a8946527aeeb4b))
* **tests:** stomp mock ([b97a334](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b97a334420baff8dc5a3381f951e326f470850e7))
* refresh keycloak access token until refresh token expires ([c436dc5](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/c436dc56e909a97e6ce013bb7415ed7d0f7a281f))
* show error for message attachment when quota is reached ([493097b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/493097bbf57e9f02cfe649c901de2b174a20e5f6))
* **webpack-dev-server:** 🎸 history fallback rewrites and caritas.local host ([20359ab](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/20359abb971c2ff6d009ea94e433d9d5a2b7c98e))


### Bug Fixes

* 🐛 'show password' eye icon on login page ([8e39712](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8e39712bfd1ae9717ddc0c69f1a4ec8484de4e72))
* 🐛 active navigation icon state with open session ([32ce785](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/32ce785f188039ed14a257aab186e215eee33be7))
* 🐛 add env var to fix heap out of memory bug ([a482e9a](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a482e9a66062ef9e42ff7894482888fa02bf3ce3))
* 🐛 add heap fix directly to npm build script ([e266c30](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e266c30607d9e1598b79dd309026985e695fd9cc))
* 🐛 add ie banner style fix ([9575942](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/95759429adb1260b3a127baf36197e722cd1d4ac))
* 🐛 add password input fields ([b2a67e3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/b2a67e3edcca22bb8e8207f69f1298904093f6e5))
* 🐛 add useMemo to routes to prevent rerender on new message ([dd28b6e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/dd28b6e7784dbe8c3c54debdefc75c055ef7456a))
* 🐛 adjust font weight on infotext label ([7b42cb3](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/7b42cb3d41d1e104895081c3d85d33f85719283a))
* 🐛 adjust isBottom calculation (allow float numbers) ([6c6d8db](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/6c6d8db6040d7877da8578228dc811d11087fe6a))
* 🐛 adjust scroll button position based on textarea height ([30b6117](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/30b6117c856f202dd257d4dc372e032a79a75a4c))
* 🐛 agency selection styles on registation ([ea6f481](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/ea6f481660e362fa441b905f68e6711cfce3c708))
* 🐛 agencySelection is TeamAgency styles ([2081d2e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/2081d2e67b337f0aaa82db4f28ce09e25221a429))
* 🐛 change email regex to have better email validation ([6c74187](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/6c74187cada82812ceb06120de9351a6c55e39e1))
* 🐛 chatInfo call on non groupChat session, deactivate stomp ([5977a32](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/5977a3282de379067c0a48511aa3ba5dc5e7f1ac))
* 🐛 checkbox icon styles and functionality ([dd46468](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/dd46468af199107443aa2a70023ad46b1455e550))
* 🐛 cleanup x-icon for styles ([f78fa9f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f78fa9ff4bfe0891e7ef9944ab7fe8cf326df0e0))
* 🐛 datepicker styles ([9e13163](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9e13163568d1f97addbdef3233a6b1a872bb8de8))
* 🐛 disable register call while request is in progress ([a7d3e2f](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/a7d3e2fa25ea9518d7fcc708e6dcecb922d24f59))
* 🐛 draft js editor focus functionality ([28b0c46](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/28b0c46d09d48c406933fe92c2a9ebf7fcbc3387))
* 🐛 edit group chat preselected duration value ([66a6574](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/66a6574d790da8a4bf2da0a7e1d79eeaefa4646b))
* 🐛 fix small functional problems labeled with TO-DO comment ([42b8ee4](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/42b8ee484741bca382b89bc4086ff684ef4ffbb0))
* 🐛 fixed condition for new enquiry on listItem click ([d7725ef](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/d7725efbe9c705eb5fdcfa512688181ba792d201))
* 🐛 fixed registration for offender ct ([66d4155](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/66d4155064c9eb968bfc97ce9b30646192872756))
* 🐛 fixing empty draft after file upload ([8bef403](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8bef40347ab443b6aa4d2341b1fefa21f6846d2c))
* 🐛 fixing profile nav item and groupchat info view ([cb128df](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/cb128df9db3e570b2b75d790d2c43d548da7b016))
* 🐛 fixing redirects for groupChats and assigning sessions ([79ed56c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/79ed56c86e6d04a2b2928624ff89e937d49f9ead))
* 🐛 fixing registration postcodeField on preselect agency ([0629e7e](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/0629e7e42767cadf5d6a57e609aad9419972a4ed))
* 🐛 hide ie11 banner before styles are loaded ([94bf7cb](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/94bf7cb04d2ea565ac88bf690eb78f048cefe5a8))
* 🐛 overwrite ieBanner inline display:none on ie11 ([9d85bfc](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/9d85bfc88bc183b6df3380abcfdc4a3991e28729))
* 🐛 postcode and agencyid for prefilled aid resorts ([8d7f48b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8d7f48b3391f2b72ea88dea12d018cc03c9822b5))
* 🐛 postcode suggestion flyout alignment ([4e10cac](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/4e10cacc30dc5359a3bb4759a9c657e483c0a6e3))
* 🐛 profile style fixes for mobile etc ([f5cdd9b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f5cdd9bfd86acc659ded97844a99054ac133d9f4))
* 🐛 radio button component style import ([fb26aaf](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/fb26aaff868f8ec14a3d25a4a503645887c3290a))
* 🐛 redirect to u25 mail center if letters in aid ([903d437](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/903d437e7fba1c0713d33d1b235e4f4466771f4f))
* 🐛 reg. overlay after button click overlapped by stage ([8ce418b](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/8ce418b59453acbf8c0a7cf795f98c4c4b5c44cf))
* 🐛 registration agency validation ([29deba5](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/29deba509e51390c4e9c1d05de180c2e88659606))
* 🐛 remove warning labels only if element not null ([e1be54c](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/e1be54ca01fcb780bd0db414e6d1bb957f19e118))
* 🐛 scroll button selector if there is no session ([95ec11a](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/95ec11ad9a5129f1a4b3a78ace2531e86733a704))
* 🐛 sessionList type error, caused by feedback session items ([17f756d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/17f756d2f38cee8633ae58ec21d634264c62038c))
* 🐛 switched overlay button function ([1ccf0b7](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/1ccf0b7db7fcd0db82e89fdb33df26e310c9f157))
* 🐛 typo in ie banner selector ([cf08eaa](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/cf08eaa0e30d316ff45d15f2b53ce7d97fa09647))
* 🐛 validation after same user/mail warning ([33a132d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/33a132d60ba3b78195518b1fcab1bcc8b16a59a1))
* 🐛 validation fix ([283c4c9](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/283c4c9f5e99a2a8d69f562f62d4e5bdb6adb2e7))
* 🐛 validation for "mail and/or username already in use" ([bd218af](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/bd218af508875f45aa84191ad98b199144c0f2e8))
* 🐛 validation of confirmation pw after changing pw ([ae4ed60](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/ae4ed607ec6f44acda400624a7628dfc78a48174))
* 🐛 warning in masterkey.js ([f7736d2](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/f7736d2051f8e296520e1c74ecabe4f9e95124d2))
* 🐛 width of infotext to prevent vertical scroll ([da8eebf](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/da8eebf2c3399c2ed3d3f70e443e3a4ded4ea9e1))
* 🐛 z-index for stage component ([de3f94d](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/de3f94d59d6018146d1aa42fc0f0db58dd1ea9f9))
* 🐛 z-index problem in kreuzbund chat ([60f1646](https://github.com/CaritasDeutschland/caritas-onlineBeratung-frontend/commit/60f1646c791c24709d8b617ac73f5bbded8f53b7))