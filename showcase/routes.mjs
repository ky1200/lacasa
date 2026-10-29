// Readable public addresses change independently of the stable vote identities.
export function canonicalItemURL(input,content,samples) {
 const u=new URL(input,'https://lacasa.invalid'),parts=u.pathname.split('/').filter(Boolean);
 const offset=parts[0]==='audit'?1:0;
 if(parts.length-offset<2||parts.length-offset>3||parts.length-offset===3&&parts.at(-1)!=='compare')return null;
 const [area,item]=parts.slice(offset),d=[...content.decisions,...(samples?.decisions??[])].find(d=>d.area===area&&d.legacySlugs?.includes(item));
 if(!d||d.slug===item)return null;
 parts[offset+1]=d.slug;u.pathname='/'+parts.join('/');return u.pathname+u.search;
}
