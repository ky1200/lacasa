const NEEDED_BY={contractor:'2026-12-03',on_site:'2026-12-03',move_in:'2027-01-15',later:'2027-06-30'};
export function readinessMissing(d){
 if(!d.publicationPolicy||d.sample||d.id?.startsWith('SAMPLE-'))return [];
 const missing=[];
 if(d.options.length<2)missing.push('At least two verified options');
 for(const o of d.options){if(o.kind==='none')continue;const name=o.label||o.name;
  const stock=o.publication?.stock;
  // Pre-order counts only when it arrives before the item is needed on site.
  const neededBy=NEEDED_BY[d.stage]??'2026-12-03',preorderInTime=stock?.status==='preorder'&&!!stock.availableBy&&stock.availableBy<=neededBy;
  if(!stock?.verified||!(['ready','low','order'].includes(stock.status)||preorderInTime)||!stock.source||!stock.checked)missing.push(name+': ready/low stock verification');
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
