'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,Lightbulb,Puzzle,RotateCcw} from 'lucide-react';
import {glossary,getSources} from '../lib/rules.mjs';

const rounds=[['SIP','Instalment','AutoPay'],['Skip','Cancel SIP','Redeem']];
const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
export default function WordPuzzle({onBack}){
 const [round,setRound]=useState(0),[words,setWords]=useState(rounds[0]),[meanings,setMeanings]=useState([...rounds[0]].reverse());
 const [selected,setSelected]=useState(null),[matched,setMatched]=useState([]),[notice,setNotice]=useState(''),[hint,setHint]=useState(false),[done,setDone]=useState(false);
 const heading=useRef(null);
 useEffect(()=>{setWords(shuffle(rounds[0]));setMeanings(shuffle(rounds[0]))},[]);
 const complete=matched.length===3;
 function begin(n){setRound(n);setWords(shuffle(rounds[n]));setMeanings(shuffle(rounds[n]));setSelected(null);setMatched([]);setNotice('');setHint(false);setDone(false);heading.current?.focus()}
 function pick(word){setSelected(word);setHint(false);setNotice(`${word} selected. Find its meaning below.`)}
 function match(word){
  if(!selected){setNotice('Choose a word tile first, then its meaning.');return}
  if(selected!==word){setNotice(`That meaning belongs to a different word. Try another for ${selected}, or use a hint.`);return}
  setMatched(m=>[...m,word]);setNotice(`Connected: ${word}. ${glossary[word].text}`);setSelected(null);setHint(false);
 }
 return <section className="puzzle-page" aria-labelledby="puzzle-heading">
  <button className="back-button" onClick={onBack}><ArrowLeft size={16}/>Back to practice</button>
  <div className="puzzle-heading"><div><span className="eyebrow">OPTIONAL · LEARN BY PLAYING</span><h1 id="puzzle-heading" tabIndex={-1} ref={heading}>Connect the SIP words</h1><p>Little tiles. Clearer meanings. Make the connections at your own pace.</p></div><span className="puzzle-emblem" aria-hidden="true"><Puzzle size={32}/></span></div>
  {done?<div className="puzzle-finish"><div className="puzzle-finish-symbol"><Check size={38}/></div><span className="eyebrow">PUZZLE COMPLETE</span><h2>Six words, connected.</h2><p>You matched all six meanings. Here’s your little reference sheet.</p><div className="puzzle-recap">{rounds.flat().map(w=><div key={w}><strong>{w}</strong><p>{glossary[w].text}</p><PuzzleSources word={w}/></div>)}</div><div className="puzzle-actions"><button className="primary" onClick={()=>begin(0)}><RotateCcw size={16}/>Shuffle & play again</button><button className="secondary" onClick={onBack}>Back to practice</button></div></div>:
  <div className="puzzle-board">
   <div className="puzzle-round"><span>ROUND {round+1} / 2</span><strong>{round===0?'The everyday words':'The actions you can take'}</strong><div className="puzzle-dots" aria-label={`${matched.length} of 3 pairs connected`}>{[0,1,2].map(i=><span className={i<matched.length?'filled':''} key={i}>{i<matched.length?<Check size={12}/>:null}</span>)}</div></div>
   <div className="puzzle-instruction"><span>1</span><h2>Choose a word</h2><small>Then tap its meaning below</small></div>
   <div className="puzzle-words" role="group" aria-label="Word tiles">{words.map(w=><button key={w} aria-pressed={selected===w} disabled={matched.includes(w)} className={`word-tile ${selected===w?'selected':''} ${matched.includes(w)?'connected':''}`} onClick={()=>pick(w)}><Puzzle size={18}/><strong>{w}</strong>{matched.includes(w)?<span><Check size={13}/>Connected</span>:<span>{selected===w?'Selected':'Tap to select'}</span>}</button>)}</div>
   <div className="puzzle-instruction"><span>2</span><h2>Connect the meaning</h2><button className="puzzle-hint-button" disabled={!selected} onClick={()=>setHint(!hint)} aria-expanded={hint}><Lightbulb size={15}/>{hint?'Hide hint':'Need a hint?'}</button></div>
   {hint&&selected&&<div className="puzzle-hint"><strong>A clue for {selected}</strong><p>{glossary[selected].text}</p><PuzzleSources word={selected}/></div>}
   <p className={`puzzle-notice ${complete?'complete':''}`} role="status">{complete?'All three connected. Ready for the next step.':notice||'Choose any word to start. You can try as many times as you like.'}</p>
   <div className="puzzle-meanings" role="group" aria-label="Meaning tiles">{meanings.map((w,i)=><div className={`meaning-tile ${matched.includes(w)?'connected':''}`} key={w}><button disabled={matched.includes(w)} onClick={()=>match(w)} aria-label={`Meaning ${String.fromCharCode(65+i)}: ${glossary[w].text}`}><span className="meaning-letter">{matched.includes(w)?<Check size={17}/>:String.fromCharCode(65+i)}</span><span>{matched.includes(w)&&<strong>{w} · Connected</strong>}{glossary[w].text}</span><span className="tile-socket" aria-hidden="true"/></button>{matched.includes(w)&&<PuzzleSources word={w}/>}</div>)}</div>
   {complete&&<div className="puzzle-round-complete"><span><Check size={18}/>{round===0?'Everyday words connected.':'Action words connected.'}</span><button className="primary" onClick={()=>{if(round===0)begin(1);else{setDone(true);heading.current?.focus()}}}>{round===0?'Next puzzle':'See all six words'}<ArrowRight size={16}/></button></div>}
  </div>}
  <div className="puzzle-footnote"><span><Puzzle size={15}/>No score. No timer. Leave whenever you like.</span><span>Uses the existing source-linked glossary · Not investment advice</span></div>
 </section>
}
function PuzzleSources({word}){return <div className="puzzle-sources">{getSources(glossary[word].sources).map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.title}<ArrowUpRight size={12}/></a>)}</div>}
