export function readinessMissing(d){
 if(!d.publicationPolicy||d.sample||d.id?.startsWith('SAMPLE-'))return [];
 const missing=[];
 if(d.options.length<2)missing.push('At least two verified options');
 for(const o of d.options){if(o.kind==='none')continue;const name=o.label||o.name;
  const stock=o.publication?.stock;
  if(!stock?.verified||!['ready','low'].includes(stock.status)||!stock.source||!stock.checked)missing.push(name+': ready/low stock verification');
  const owner=o.publication?.owner;
  if(!(owner?.source&&owner.exactModel)&&!owner?.reason)missing.push(name+': exact-model owner report or reason');

 }
 for(const brand of d.requiredBrands??[])if(!d.brandReview?.some(b=>b.brand.toLowerCase()===brand.toLowerCase()&&b.reason&&b.source))missing.push(brand+': comparison or exclusion reason');
 return [...missing,...(d.publicationHolds??[])];
}
export function publicationState(d){
 const missing=readinessMissing(d);
 return missing.length&&d.status==='voting'?{...d,status:'draft',researchMissing:missing}:d;
}
