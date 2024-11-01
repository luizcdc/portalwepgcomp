'use client'
export default function Calendar({ color }: {  color: string}) {
    return (
        <svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.7412 2.42993V7.28968M10.8892 2.42993V7.28968M4.10669 12.1494H28.5237M6.81969 4.8598H25.8107C27.3091 4.8598 28.5237 5.9477 28.5237 7.28968V24.2988C28.5237 25.6408 27.3091 26.7287 25.8107 26.7287H6.81969C5.32134 26.7287 4.10669 25.6408 4.10669 24.2988V7.28968C4.10669 5.9477 5.32134 4.8598 6.81969 4.8598Z" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>        
    );
};