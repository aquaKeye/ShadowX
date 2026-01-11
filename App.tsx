import React, { useState } from 'react';
import { ScoreGauge } from './components/ScoreGauge';
import { RiskList } from './components/RiskList';
import { AnalysisStage, Tweet, AnalysisResult } from './types';
import { fetchMockProfile } from './services/mockDataService';
import { analyzeProfile } from './services/scoringService';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [stage, setStage] = useState<AnalysisStage>(AnalysisStage.IDLE);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setStage(AnalysisStage.FETCHING);
    setErrorMsg('');
    setResult(null);
    setIsVerified(false);

    try {
      const profileData = await fetchMockProfile(username);
      setTweets(profileData.tweets);
      setIsVerified(profileData.isVerified);

      setStage(AnalysisStage.ANALYZING);
      // Simulate "Thinking" time
      await new Promise(r => setTimeout(r, 1200));

      const analysis = analyzeProfile(profileData.tweets, profileData.isVerified);
      setResult(analysis);
      setStage(AnalysisStage.COMPLETE);

    } catch (err: any) {
      console.error(err);
      setStage(AnalysisStage.ERROR);
      setErrorMsg(err.message || "Failed to retrieve profile data.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-full bg-black">
      {/* 
        MASTER CONTAINER 
        Max Width ~1265px centered.
        Added `justify-center` to ensure the columns are strictly centered in the viewport.
      */}
      <div className="flex w-full max-w-[1265px] justify-center">

        {/* =====================================================================================
            LEFT COLUMN (Navigation)
            Width: 275px (XL), 88px (Small/Medium)
            Fixed/Sticky
            Aligned to the end (right) to touch the main feed.
        ===================================================================================== */}
        <header className="hidden sm:flex flex-col items-end w-[88px] md:w-[275px] pr-2 md:pr-6 flex-shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar z-50">
          <div className="w-full h-full flex flex-col justify-between py-1">
            <div className="w-full">
              {/* Logo */}
              <div className="p-3 w-fit rounded-full hover:bg-[#181818] cursor-pointer transition-colors mb-1 md:ml-0">
                <img src="/static/sx_logo.png" alt="s(x)" className="w-[40px] h-[40px]" />
              </div>

              {/* Navigation Links */}
              <nav className="mt-2 space-y-1 w-full">
                <NavLink icon={<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />} text="GitHub" href="https://github.com/aquaKeye/ShadowX" />
                <NavLink icon={<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />} text="X" href="https://x.com/CondVira" />
              </nav>

              {/* Main Action Button */}
              <div className="my-4 w-full">
                <div className="md:hidden bg-[#EFF3F4] hover:bg-[#d4dce1] text-black rounded-full w-[50px] h-[50px] flex items-center justify-center cursor-pointer">
                  <span className="font-bold text-xs">$</span>
                </div>
              </div>
            </div>

            {/* Profile Pill */}
            <div className="mb-4 flex items-center gap-3 p-3 rounded-full hover:bg-[#181818] cursor-pointer transition-colors w-full">
              <div className="w-10 h-10 rounded-full bg-slate-600"></div>
              <div className="hidden md:block flex-1 overflow-hidden leading-5">
                <div className="font-bold text-[15px] truncate text-[#e7e9ea]">Guest User</div>
                <div className="text-[15px] truncate text-[#71767b]">@anon_wallet</div>
              </div>
              <div className="hidden md:block">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#e7e9ea]"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================================================
            CENTER COLUMN (Main Feed)
            Width: 600px
            Borders: Left & Right
        ===================================================================================== */}
        <main className="flex-1 max-w-[600px] w-full border-x border-[#2f3336] min-h-screen">

          {/* Sticky Header */}
          <div className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-[#2f3336] px-4 h-[53px] flex items-center cursor-pointer">
            <h2 className="text-[20px] font-bold text-[#e7e9ea]">ShadowX</h2>
          </div>

          {/* Compose / Input Area */}
          <div className="px-4 py-3 border-b border-[#2f3336] flex gap-3">
            <div className="flex-shrink-0 pt-1">
              <div className="w-10 h-10 rounded-full bg-slate-600"></div>
            </div>
            <div className="flex-1">
              <form onSubmit={handleScan}>
                <div className="relative py-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username to analyze..."
                    className="w-full bg-transparent text-[20px] text-[#e7e9ea] placeholder-[#71767b] border-none focus:ring-0 outline-none p-0"
                    disabled={stage === AnalysisStage.FETCHING || stage === AnalysisStage.ANALYZING}
                  />
                </div>

                <div className="mt-2 border-t border-[#2f3336]/0 pt-2 flex items-center justify-between">
                  <div className="flex gap-0 -ml-2 text-[#1d9bf0]">
                    <IconButton path="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                    <IconButton path="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" />
                    <IconButton path="M8 10c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4zm2 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z" />
                    <IconButton path="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
                  </div>
                  <button
                    type="submit"
                    disabled={!username.trim() || stage === AnalysisStage.FETCHING || stage === AnalysisStage.ANALYZING}
                    className="bg-[#EFF3F4] hover:bg-[#d4dce1] text-black font-bold px-4 py-2 rounded-full text-[15px] disabled:opacity-50 transition-colors"
                  >
                    {stage === AnalysisStage.FETCHING ? 'Fetching...' : stage === AnalysisStage.ANALYZING ? 'Scanning...' : 'Check Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Feed */}
          <div>
            {/* Loading Skeleton */}
            {(stage === AnalysisStage.FETCHING || stage === AnalysisStage.ANALYZING) && (
              <div className="p-4 border-b border-[#2f3336] animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#333639]"></div>
                  <div className="flex-1 space-y-3 pt-2">
                    <div className="w-32 h-4 bg-[#333639] rounded"></div>
                    <div className="w-full h-32 bg-[#333639] rounded-xl"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {stage === AnalysisStage.ERROR && (
              <div className="p-4 text-[#f91880] text-center border-b border-[#2f3336]">
                {errorMsg}
              </div>
            )}

            {/* Main Result (Pinned Tweet Style) */}
            {stage === AnalysisStage.COMPLETE && result && (
              <div>
                <article className="px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer relative overflow-hidden">
                  {/* Thread Line connecting to replies */}
                  {result.factors.length > 0 && <div className="absolute left-[34px] top-[60px] w-[2px] bg-[#333639] h-full z-0"></div>}

                  <div className="flex gap-3 relative z-10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold text-sm border-2 border-black z-10 relative">SA</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-[15px] justify-between">
                        <div className="flex items-center gap-1 overflow-hidden">
                          <span className="font-bold text-[#e7e9ea] truncate">Shadowban Analyzer</span>
                          <span className="text-[#1d9bf0] flex-shrink-0">
                            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.497.782 2.798 1.942 3.48-.02.17-.03.34-.03.52 0 2.21 1.71 3.998 3.818 3.998.47 0 .92-.084 1.336-.25.62 1.333 1.926 2.25 3.437 2.25 1.512 0 2.818-.917 3.437-2.25.415.165.865.25 1.336.25 2.11 0 3.818-1.79 3.818-4 0-.18-.01-.35-.03-.52 1.16-.682 1.942-1.983 1.942-3.48ZM9.152 16.083l-2.717-2.718 1.06-1.06 1.657 1.657 4.657-4.657 1.06 1.06-5.717 5.718Z"></path></g></svg>
                          </span>
                          <span className="text-[#71767b] truncate">@sb_analyzer</span>
                          <span className="text-[#71767b]">·</span>
                          <span className="text-[#71767b]">now</span>
                        </div>
                        <div className="text-[#71767b] hover:text-[#1d9bf0] rounded-full p-2 hover:bg-[#1d9bf0]/10 -mr-2">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                        </div>
                      </div>

                      <div className="text-[15px] mt-0 text-[#e7e9ea] leading-5 whitespace-pre-wrap">
                        Analysis complete for <span className="text-[#1d9bf0] hover:underline">@{username}</span>
                        <br />
                        <div className="mt-3 border border-[#2f3336] rounded-2xl overflow-hidden">
                          <div className="p-4 bg-black/50 flex items-center gap-6">
                            <ScoreGauge score={result.score} />
                            <div className="flex-1 py-2">
                              <div className="uppercase text-xs text-[#71767b] font-bold tracking-wider mb-1">Status Verdict</div>
                              <div className={`text-xl font-bold mb-1 ${result.riskLevel === 'LOW' ? 'text-[#00ba7c]' :
                                result.riskLevel === 'MEDIUM' ? 'text-[#ffd400]' : 'text-[#f91880]'
                                }`}>
                                {result.verdict}
                              </div>
                              <div className="text-[#71767b] text-sm">
                                {result.tweetsScanned} tweets analyzed.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <TweetActions replies={result.factors.length} retweets={12} likes={84} views={3420} />
                    </div>
                  </div>
                </article>

                {/* Thread Replies */}
                <RiskList factors={result.factors} />

                {/* Recommendations End Tweet */}
                {result.recommendations.length > 0 && (
                  <article className="px-4 py-3 border-b border-[#2f3336] hover:bg-[#080808] transition-colors cursor-pointer flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-bold text-sm border-2 border-black">SA</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center text-[15px] mb-1">
                        <span className="font-bold text-[#e7e9ea] mr-1">Shadowban Analyzer</span>
                        <span className="text-[#1d9bf0] mr-1">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.02-2.147 3.6 0 1.497.782 2.798 1.942 3.48-.02.17-.03.34-.03.52 0 2.21 1.71 3.998 3.818 3.998.47 0 .92-.084 1.336-.25.62 1.333 1.926 2.25 3.437 2.25 1.512 0 2.818-.917 3.437-2.25.415.165.865.25 1.336.25 2.11 0 3.818-1.79 3.818-4 0-.18-.01-.35-.03-.52 1.16-.682 1.942-1.983 1.942-3.48ZM9.152 16.083l-2.717-2.718 1.06-1.06 1.657 1.657 4.657-4.657 1.06 1.06-5.717 5.718Z"></path></g></svg>
                        </span>
                        <span className="text-[#71767b] font-normal">@sb_analyzer</span>
                        <span className="text-[#71767b] mx-1">·</span>
                        <span className="text-[#71767b]">now</span>
                      </div>
                      <div className="text-[15px] text-[#e7e9ea] leading-5">
                        Replying to <span className="text-[#1d9bf0]">@user</span>
                        <br /><br />
                        <div className="font-bold mb-1">Recommendation Plan:</div>
                        <ul className="list-disc pl-4 space-y-1 text-[#e7e9ea]">
                          {result.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <TweetActions replies={0} retweets={2} likes={15} views={890} />
                    </div>
                  </article>
                )}
              </div>
            )}
          </div>
        </main>

        {/* =====================================================================================
            RIGHT COLUMN (Widgets)
            Width: 350px
            Hidden on Tablet/Mobile
        ===================================================================================== */}
        <aside className="hidden lg:block w-[350px] pl-8 py-3 flex-shrink-0 min-h-screen">
          <div className="sticky top-0 h-screen overflow-y-auto no-scrollbar pb-10">
            {/* Search Bar */}
            <div className="bg-[#202327] rounded-full h-[44px] flex items-center px-4 mb-4 text-[#71767b] focus-within:bg-black focus-within:border focus-within:border-[#1d9bf0] focus-within:text-[#1d9bf0] group border border-transparent">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-3"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.73 3.815-1.945 5.232l4.959 4.959-1.414 1.414-4.959-4.959C14.065 18.27 12.236 19 10.25 19c-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
              <input type="text" placeholder="Search" className="bg-transparent border-none text-[15px] text-[#e7e9ea] w-full focus:ring-0 placeholder-[#71767b] h-full" />
            </div>

            {/* Card 1: About */}
            <div className="bg-[#16181c] rounded-2xl overflow-hidden mb-4 border border-[#16181c]">
              <h3 className="font-bold text-[20px] px-4 py-3">Why use this?</h3>
              <div className="px-4 pb-4 text-[15px] text-[#e7e9ea] leading-5">
                Twitter's algorithms are invisible. We reverse-engineered the shadowban triggers to help you stay visible. Powered by LLM.
              </div>
              <div className="px-4 py-3 border-t border-[#2f3336] hover:bg-[#1d1f23] cursor-pointer transition-colors text-[#1d9bf0] text-[15px]">
                Subscribe to Premium
              </div>
            </div>

            {/* Card 2: Trends */}
            <div className="bg-[#16181c] rounded-2xl overflow-hidden border border-[#16181c]">
              <h3 className="font-bold text-[20px] px-4 py-3">Trends for you</h3>
              <TrendItem category="Technology · Trending" title="#ShadowbanFix" count="12.5K posts" />
              <TrendItem category="Trending in Crypto" title="ShadowX" count="54.2K posts" />
              <TrendItem category="Trending" title="Elon Musk" count="105K posts" />
              <TrendItem category="Business · Trending" title="Search Ban" count="2,120 posts" />
              <div className="px-4 py-3 text-[#1d9bf0] text-[15px] hover:bg-[#1d1f23] cursor-pointer rounded-b-2xl">Show more</div>
            </div>

            {/* Footer */}
            <nav className="px-4 py-4 text-[13px] text-[#71767b] leading-4 flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Ads info</a>
              <span className="flex items-center gap-1">More <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg></span>
              <span>© 2024 Shadowban Analyzer</span>
            </nav>
          </div>
        </aside>

      </div>
    </div>
  );
};

// --- Sub Components ---

const NavLink: React.FC<{ icon: React.ReactNode; text: string; active?: boolean; href?: string }> = ({ icon, text, active, href = "#" }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center w-fit md:w-full">
    <div className="flex items-center gap-4 p-3 rounded-full group-hover:bg-[#181818] transition-colors">
      <div className="relative">
        <svg viewBox="0 0 24 24" className={`w-[26.25px] h-[26.25px] fill-current ${active ? 'text-[#e7e9ea]' : 'text-[#e7e9ea]'}`}>
          <g>{icon}</g>
        </svg>
      </div>
      <span className={`hidden md:block text-[20px] mr-4 ${active ? 'font-bold' : 'font-normal text-[#e7e9ea]'}`}>{text}</span>
    </div>
  </a>
);

const IconButton: React.FC<{ path: string }> = ({ path }) => (
  <div className="w-[34px] h-[34px] flex items-center justify-center rounded-full hover:bg-[#1d9bf0]/10 cursor-pointer transition-colors">
    <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current"><g><path d={path}></path></g></svg>
  </div>
);

const TrendItem: React.FC<{ category: string; title: string; count: string }> = ({ category, title, count }) => (
  <div className="px-4 py-3 hover:bg-[#1d1f23] cursor-pointer transition-colors relative">
    <div className="text-[13px] text-[#71767b] flex justify-between">
      <span>{category}</span>
      <div className="w-8 h-8 flex items-center justify-center hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] rounded-full -m-2 transition-colors text-[#71767b]">
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
      </div>
    </div>
    <div className="font-bold text-[15px] mt-0.5 text-[#e7e9ea]">{title}</div>
    <div className="text-[13px] text-[#71767b] mt-0.5">{count}</div>
  </div>
);

const TweetActions: React.FC<{ replies: number, retweets: number, likes: number, views: number }> = ({ replies, retweets, likes, views }) => (
  <div className="flex justify-between mt-3 max-w-[425px] text-[#71767b] text-[13px]">
    <div className="flex items-center group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors -ml-2"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg></div>
      <span className="group-hover:text-[#1d9bf0] ml-1">{replies > 0 ? replies : ''}</span>
    </div>
    <div className="flex items-center group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-[#00ba7c]/10 group-hover:text-[#00ba7c] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg></div>
      <span className="group-hover:text-[#00ba7c] ml-1">{retweets}</span>
    </div>
    <div className="flex items-center group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-[#f91880]/10 group-hover:text-[#f91880] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.605 3.01.894 1.81.846 4.17-.514 6.67z"></path></g></svg></div>
      <span className="group-hover:text-[#f91880] ml-1">{likes}</span>
    </div>
    <div className="flex items-center group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg></div>
      <span className="group-hover:text-[#1d9bf0] ml-1">{views}</span>
    </div>
    <div className="flex items-center group cursor-pointer">
      <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors"><svg viewBox="0 0 24 24" className="w-[18.75px] h-[18.75px] fill-current"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg></div>
    </div>
  </div>
);

export default App;