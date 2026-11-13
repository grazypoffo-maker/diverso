import {useEffect} from 'react';
// Keep the page behind a mobile sheet still, and size the sheet to the visible
// viewport when the iPhone keyboard opens. Do not disable pinch zoom.
export function useMobileOverlay(open){
 useEffect(()=>{if(!open||!window.matchMedia('(max-width: 720px)').matches)return;const y=window.scrollY,body=document.body,root=document.documentElement,previous=body.style.cssText,focus=document.activeElement;const viewport=window.visualViewport;
 const resize=()=>{root.style.setProperty('--sheet-height',`${viewport?.height||window.innerHeight}px`);root.style.setProperty('--sheet-top',`${viewport?.offsetTop||0}px`)};
 body.style.position='fixed';body.style.top=`-${y}px`;body.style.width='100%';body.style.overflow='hidden';resize();viewport?.addEventListener('resize',resize);viewport?.addEventListener('scroll',resize);
 function trap(e){if(e.key!=='Tab')return;const dialog=document.querySelector('[role="dialog"]');if(!dialog)return;const controls=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select,textarea,[tabindex="0"]')].filter(el=>el.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
 document.addEventListener('keydown',trap);return()=>{viewport?.removeEventListener('resize',resize);viewport?.removeEventListener('scroll',resize);document.removeEventListener('keydown',trap);body.style.cssText=previous;root.style.removeProperty('--sheet-height');root.style.removeProperty('--sheet-top');window.scrollTo(0,y);if(focus?.isConnected)focus.focus({preventScroll:true})};
 },[open]);
}
