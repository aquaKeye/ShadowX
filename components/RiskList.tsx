import React from 'react';
import { RiskFactor } from '../types';

interface RiskListProps {
  factors: RiskFactor[];
}

export const RiskList: React.FC<RiskListProps> = ({ factors }) => {
  if (factors.length === 0) {
    return null;
  }

  return (
    <div className="pb-0">
      {factors.map((factor, index) => (
        <article key={factor.id} className="flex px-4 py-3 border-b border-[#3d2c28] hover:bg-[#251a17] transition-colors cursor-pointer relative">
          
          {/* Thread Connector Line (Visual only, no logic needed if list is contiguous) */}
          
          {/* Left Column: Avatar Area */}
          <div className="flex flex-col items-center mr-3 w-12 flex-shrink-0 pt-1">
             {/* Avatar */}
             <div className="w-10 h-10 rounded-full bg-[#c41e3a] flex items-center justify-center text-white font-bold text-sm border-2 border-black">
               SA
             </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center text-[15px] mb-0.5">
              <span className="font-bold text-[#f4e4bc] mr-1 truncate">molt shadowX</span>
              <span className="text-[#c41e3a] mr-1 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.497.782 2.798 1.942 3.48-.02.17-.03.34-.03.52 0 2.21 1.71 3.998 3.818 3.998.47 0 .92-.084 1.336-.25.62 1.333 1.926 2.25 3.437 2.25 1.512 0 2.818-.917 3.437-2.25.415.165.865.25 1.336.25 2.11 0 3.818-1.79 3.818-4 0-.18-.01-.35-.03-.52 1.16-.682 1.942-1.983 1.942-3.48ZM9.152 16.083l-2.717-2.718 1.06-1.06 1.657 1.657 4.657-4.657 1.06 1.06-5.717 5.718Z"></path></g></svg>
              </span>
              <span className="text-[#8b7355] truncate">@sb_analyzer</span>
              <span className="text-[#8b7355] mx-1">·</span>
              <span className="text-[#8b7355]">now</span>
            </div>
            
            <div className="text-[#f4e4bc] text-[15px] leading-5">
               <span className="text-[#8b7355]">Replying to</span> <span className="text-[#c41e3a]">@user</span>
               <div className="mt-1">
                 <span className="font-bold text-[#ff6b5b]">⚠️ {factor.name} Detected</span>
                 <p className="mt-1">{factor.description}</p>
                 <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-[#f91880]/10 text-[#ff6b5b] text-xs font-bold">
                    Penalty: -{factor.deduction} pts
                 </div>
               </div>
            </div>

            {/* Actions Fake */}
            <div className="flex justify-between mt-3 max-w-[425px] text-[#8b7355] text-[13px]">
                <div className="flex items-center group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-[#c41e3a]/10 group-hover:text-[#c41e3a] transition-colors -ml-2"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg></div>
                    <span className="group-hover:text-[#c41e3a] ml-1">1</span>
                </div>
                <div className="flex items-center group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-[#2d8f7a]/15 group-hover:text-[#2d8f7a] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg></div>
                    <span className="group-hover:text-[#2d8f7a] ml-1"></span>
                </div>
                <div className="flex items-center group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-[#ff6b5b]/15 group-hover:text-[#ff6b5b] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.605 3.01.894 1.81.846 4.17-.514 6.67z"></path></g></svg></div>
                    <span className="group-hover:text-[#ff6b5b] ml-1"></span>
                </div>
                <div className="flex items-center group cursor-pointer">
                    <div className="p-2 rounded-full group-hover:bg-[#c41e3a]/10 group-hover:text-[#c41e3a] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg></div>
                    <span className="group-hover:text-[#c41e3a] ml-1">450</span>
                </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};