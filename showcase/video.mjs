import {eligibleVideo} from './media.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// A real same-site document provides a stable embed origin in mobile webviews.
export function videoPage(content,id,origin){
 if(!/^[-_a-zA-Z0-9]{11}$/.test(id))return null;
 const option=content.decisions.flatMap(d=>d.options).find(o=>o.video?.youtubeId===id);if(!option||!eligibleVideo(option.video))return null;
 const src=new URL('https://www.youtube-nocookie.com/embed/'+id);
 for(const [key,value]of Object.entries({autoplay:'1',playsinline:'1',rel:'0',origin,widget_referrer:origin}))src.searchParams.set(key,value);
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>${escape(option.video.title)} · LaCasa</title><style>html,body{margin:0;height:100%;background:#000}iframe{display:block;width:100%;height:100%;min-height:200px;border:0}</style></head><body><iframe title="${escape(option.video.title)}" src="${escape(src.href)}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></body></html>`;
}
