export const CHECKED = '7 November 2026';
const root='https://groww.in/';
export const sources = [
 ['S1','When can I edit my SIP?','help/mutual-funds/discoverable/when-can-i-edit-my-sip--29'],
 ['S2','How to edit an SIP on Groww','blog/how-to-edit-sip-on-groww'],
 ['S3','How long can I skip my SIP?','help/mutual-funds/mf-sip/what-is-the-maximum-period-for-which-i-can-skip-my-sip-installments--63'],
 ['S4','How to skip an instalment','help/mutual-funds/mf-sip/how-to-skip-an-sip-instalment--79'],
 ['S5','Paying after the pending SIP date','help/mutual-funds/mf-dashboard/what-happens-if-i-pay-after-date-shown-on-pending-sip--42'],
 ['S6','Paying a missed instalment','help/mutual-funds/mf-sip/how-do-i-pay-for-a-missed-installment-3'],
 ['S7','When an AutoPay debit fails','help/mutual-funds/mf-sip/how-do-i-pay-for-my-sip-installment-if-the-autopay-debit-has-failed--40'],
 ['S8','Checking whether money was deducted','help/mutual-funds/order/how-can-i-confirm-if-my-sip-instalment-was-deducted-successfully--18'],
 ['S9','Money deducted but order missing','help/mutual-funds/mf-sip/sip-installment-was-deducted-but-the-order-is-not-reflected-on-the-dashboard'],
 ['S10','What an AutoPay mandate means','help/my-account/ma-bank-accounts/what-does-autopay-mandate-limit-mean--49'],
 ['S11','Cancelling an ongoing SIP','help/mutual-funds/mf-sip/how-to-cancel-my-sip'],
 ['S12','SIP cancellation conditions','help/mutual-funds/order/can-i-cancel-my-sip-as-per-my-wish'],
 ['S13','Understanding a SIP','p/sip-systematic-investment-plan']
].map(([id,title,path])=>({id,title,url:root+path,checked:CHECKED}));
export const rules = [
 {id:'edit',title:'An edit may affect a later payment',text:'Groww says an amount or date edit made within 2 working days of the next instalment will not affect that instalment. Check the effective instalment in the confirmation. An edit for a SIP created today may take up to 2 days to process.',sources:['S1'],tags:'edit change amount date reduce lower increase old next payment badal kam paise बदल राशि कम'},
 {id:'skip',title:'One instalment at a time',text:'Groww allows one instalment to be skipped at a time. Another skip request can be placed after that skipped date has passed. A skip is not an open-ended pause.',sources:['S3'],tags:'skip pause month resume miss break rok रोक छोड़ महीना'},
 {id:'third-skip',title:'Three consecutive skips',text:'Groww’s help page states that three consecutive skipped instalments automatically cancel the SIP. Its skip instructions also refer to three skipped or missed instalments in a row. Check your actual history; this practice cannot see it.',sources:['S3','S4'],tags:'skip third three 3 consecutive cancellation repeated teesri teen तीन'},
 {id:'timing',title:'The timing wording is not consistent',text:'Groww’s edit page says 2 working days, while its skip pages say 2 days. I cannot confirm a precise real-life deadline from these conflicting descriptions. Check the affected instalment shown in Groww or ask its support.',sources:['S1','S3'],tags:'skip tomorrow deadline working holiday weekend today two 2 days kab kal कब कल दिन'},
 {id:'failed',title:'Check the payment status first',text:'Groww lists insufficient balance and bank payment-system issues as possible reasons for a failed debit. If the debit has failed, its help page describes a Pay option on the dashboard. This does not establish why your payment failed or whether that option is available for you.',sources:['S7'],tags:'failed failure bank balance autopay technical payment insufficient fail paisa nahi नहीं पैसा बैलेंस'},
 {id:'retry',title:'The dashboard may offer a retry',text:'For an instalment that failed because of insufficient balance, Groww describes Pay Now being available for 2 working days. Another page says a payment after the displayed pending-SIP date is treated as failed. Check the displayed status and eligibility; do not assume a fresh deadline.',sources:['S6','S5'],tags:'retry pay now missed balance manual late deadline bhool भूल'},
 {id:'deducted',title:'Deduction and completion are different',text:'A bank debit does not by itself confirm unit allotment. Groww says order processing and unit allocation can take up to 5–6 business days depending on the fund and payment method. Check the order status; do not make another payment just because the first one is unclear.',sources:['S8'],tags:'deducted debited pending units allocation allotted processing twice again kata कट गया'},
 {id:'missing',title:'An order missing from the dashboard',text:'For money deducted but no order showing, Groww’s specific help page says to contact support if the issue persists more than 2 working days after deduction. A missing order is different from a visible order awaiting unit allotment.',sources:['S9'],tags:'missing absent not reflected dashboard money deducted order gayab गायब'},
 {id:'cancel',title:'Cancelling does not withdraw existing investments',text:'Cancelling a SIP stops future scheduled instalments; the existing investment remains until redeemed separately. Groww’s cancellation pages disagree on timing: one says 7 days, another says 3 working days. I cannot confirm the live deadline; check with Groww.',sources:['S11','S12'],tags:'cancel redeem withdraw stop refund close cancellation band बंद निकाल'},
 {id:'mandate',title:'AutoPay is permission for automatic payment',text:'An AutoPay mandate is permission for SIP payments to be deducted from the linked bank account. It does not guarantee every debit will succeed. This prototype does not confirm how to disable your mandate or switch your account back to manual payments.',sources:['S10','S7'],tags:'autopay mandate permission meaning manual disable setup automatic मतलब मैंडेट'},
 {id:'terms',title:'A SIP is a way of investing regularly',text:'A SIP is a way to invest a set amount in a mutual fund at regular intervals. An instalment is one scheduled payment. Units are the portions of the fund an investment buys; allotment means those units are assigned to you.',sources:['S13','S8'],tags:'sip meaning term definition explain units allotment समझ मतलब क्या'}
];
export const glossary = {
 'SIP':{text:'A way to invest a set amount in a mutual fund at regular intervals.',sources:['S13']},
 'Instalment':{text:'One scheduled payment in your SIP.',sources:['S13']},
 'AutoPay':{text:'Permission to deduct SIP payments from your linked bank account automatically. Payments can still fail.',sources:['S10','S7']},
 'Working days':{text:'Processing days rather than every calendar day. The reviewed help pages do not establish a complete holiday calendar or daily cut-off. This demo uses stated sample timing, not real-date eligibility.',sources:['S1','S3']},
 'Units':{text:'The portions of a mutual fund your investment buys. Allotment is when those units are assigned to you.',sources:['S13','S8']},
 'Skip':{text:'Leave out one scheduled instalment, subject to the timing and consecutive-skip rules.',sources:['S3']},
 'Cancel SIP':{text:'Stop future scheduled instalments. Existing investments are not automatically withdrawn.',sources:['S11']},
 'Redeem':{text:'Sell existing mutual fund units to withdraw their value. This is separate from cancelling a SIP.',sources:['S13','S11']}
};
export function getSources(ids){return [...new Set(ids)].map(id=>sources.find(s=>s.id===id)).filter(Boolean)}
