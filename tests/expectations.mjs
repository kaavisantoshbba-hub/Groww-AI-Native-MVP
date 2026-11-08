// Draft labels: requires human review, separate from discovery tagging.
export default [
 {id:'C01',q:'The next payment will still be 2000 and the one after will be 1500.',context:{intent:'check',task:'edit',timing:'near',amount:1500},verdict:'matches'},
 {id:'C02',q:'My very next payment will be 1500.',context:{intent:'check',task:'edit',timing:'near',amount:1500},verdict:'needs_correction'},
 {id:'C03',q:'Both the next and following payment use 1800.',context:{intent:'check',task:'edit',timing:'later',amount:1800},verdict:'matches'},
 {id:'C04',q:'Yes.',context:{intent:'check',task:'edit',timing:'near'},verdict:'unclear'},
 {id:'C05',q:'The third consecutive skip cancels my SIP.',context:{intent:'check',task:'skip',timing:'later',skips:2},verdict:'matches'},
 {id:'C06',q:'My SIP resumes automatically after this third skip.',context:{intent:'check',task:'skip',timing:'later',skips:2},verdict:'needs_correction'},
 {id:'C07',q:'Money left my bank so I should pay again because the order is missing.',context:{intent:'check',task:'payment',debit:'yes',status:'missing'},verdict:'needs_correction'},
 {id:'C08',q:'I should not pay again just because the order is missing; contact support if it lasts more than 2 working days.',context:{intent:'check',task:'payment',debit:'yes',status:'missing'},verdict:'matches'},
 {id:'C09',q:'It definitely failed because I had insufficient balance.',context:{intent:'check',task:'payment',debit:'no',status:'failed'},verdict:'needs_correction'},
 {id:'C10',q:'The status is unknown, so I should verify with support rather than assume success.',context:{intent:'check',task:'payment',debit:'yes',status:'unknown'},verdict:'matches'}
];
