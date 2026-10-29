// A missing video is preferable to a different model or unknown language.
export function eligibleVideo(v){return !!v&&v.displayAllowed!==false&&v.scope==='exact'&&!!v.thumbnail&&/^[-_a-zA-Z0-9]{11}$/.test(v.youtubeId??'')&&(v.language==='en'||v.englishSubtitlesVerified===true);}
