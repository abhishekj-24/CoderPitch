import { useEffect, useState } from 'react';
import axiosClient from '../utils/axios';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [communityStats, setCommunityStats] = useState({ views: 0, solutions: 0, discussions: 0, reputation: 0 });
  const [solvedList, setSolvedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosClient.get('/user/profile');
        setStats(data.stats || []);
        setTotal(data.totalSolved || 0);
        setSolvedList(data.solvedProblems || []);
        if (data.communityStats) setCommunityStats(data.communityStats);
      } catch (err) {
        console.error('profile fetch error', err);
        setError(err.response?.data?.error || err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getCount = key => {
    const row = stats.find(s => s._id === key);
    return row ? row.count : 0;
  };

  const easy = getCount('easy');
  const medium = getCount('medium');
  const hard = getCount('hard');

  const easyPct = total ? Math.round((easy / total) * 100) : 0;
  const mediumPct = total ? Math.round((medium / total) * 100) : 0;
  const hardPct = total ? Math.round((hard / total) * 100) : 0;

  // SVG donut will be rendered for crisper, rounded segments
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const clamp = v => Math.max(0, Math.min(100, v));
  const e = clamp(easyPct);
  const m = clamp(mediumPct);
  const h = clamp(hardPct);
  const segments = [
    { pct: e, color: '#10B981' },
    { pct: m, color: '#F59E0B' },
    { pct: h, color: '#EF4444' }
  ];

  return (
    <div className="min-h-screen flex justify-center items-start relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 py-5">
      <div className="container mx-auto p-4 mt-5 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <aside className="lg:col-span-1">
            <div className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl p-6 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-white">{user?.firstname?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{user?.firstname || 'User'}</h2>
                  <p className="text-sm text-gray-300">@{user?.emailid?.split('@')[0]}</p>
                  <p className="mt-1 text-xs text-gray-400">Global Rank: <span className="font-medium text-gray-200">#1,245</span></p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mt-4">Full-stack Developer. Passionate about algorithms and system design.</p>

              <div className="mt-4 flex space-x-3">
                <a href="/profile/edit" className="flex-1 btn btn-primary">Edit Profile</a>
                <button className="btn btn-ghost text-white">Share</button>
              </div>
            </div>
            <div className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl p-4 mt-6 rounded-xl">
              <div className="text-xs text-gray-400 uppercase">Community Stats</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-white">
                <div className="text-center">
                  <div className="text-lg font-semibold">{communityStats.views}</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{communityStats.solutions}</div>
                  <div className="text-xs text-gray-400">Solutions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{communityStats.discussions}</div>
                  <div className="text-xs text-gray-400">Discussions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{communityStats.reputation}</div>
                  <div className="text-xs text-gray-400">Reputation</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Solved Problems Card */}
            <div className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Solved Problems</h3>
                <div className="text-sm text-gray-400">{total} solved</div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex items-center justify-center">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="relative">
                    <g transform="translate(80,80) rotate(-90)">
                      {/* base track */}
                      <circle r={radius} fill="transparent" stroke="#111827" strokeWidth="20" />
                      {/* segments */}
                      {(() => {
                        let offset = 0;
                        return segments.map((s, i) => {
                          const len = (s.pct / 100) * circumference;
                          const dasharray = `${len} ${circumference - len}`;
                          const stroke = (
                            <circle
                              key={i}
                              r={radius}
                              fill="transparent"
                              stroke={s.color}
                              strokeWidth="20"
                              strokeDasharray={dasharray}
                              strokeDashoffset={-offset}
                              strokeLinecap="round"
                            />
                          );
                          offset += len;
                          return stroke;
                        });
                      })()}
                    </g>
                    {/* center label */}
                    <foreignObject x="40" y="40" width="80" height="80">
                      <div className="w-20 h-20 bg-gray-900 rounded-full flex flex-col items-center justify-center text-center">
                        <div className="text-2xl font-bold text-white">{total}</div>
                        <div className="text-xs text-gray-400">Solved</div>
                      </div>
                    </foreignObject>
                  </svg>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium text-gray-300">Easy</div>
                        <div className="text-sm text-gray-400">{easy} / {total}</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="h-3 rounded-full bg-emerald-400" style={{ width: `${easyPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium text-gray-300">Medium</div>
                        <div className="text-sm text-gray-400">{medium} / {total}</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="h-3 rounded-full bg-yellow-400" style={{ width: `${mediumPct}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm font-medium text-gray-300">Hard</div>
                        <div className="text-sm text-gray-400">{hard} / {total}</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div className="h-3 rounded-full bg-red-400" style={{ width: `${hardPct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap / Activity
            <div className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl p-6 rounded-xl">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-white">1,842 submissions in the past year</h4>
                <div className="text-sm text-gray-400">2024</div>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-20 gap-1">
                  {Array.from({ length: 140 }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${i % 7 === 0 ? 'bg-blue-600' : i % 5 === 0 ? 'bg-blue-400' : 'bg-blue-800/40'}`} />
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-3">Active — Inactive</div>
              </div>
            </div> */}

            {/* Recent Submissions */}
            <div className="card bg-gray-900/60 backdrop-blur-md border border-gray-700 shadow-2xl p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-white">history Recent Submissions</h4>
                
                <NavLink to="/" className="text-sm text-indigo-400">View all problems</NavLink>
              </div>

              <div className="mt-4 divide-y">
                {loading && <div className="text-sm text-gray-400">Loading...</div>}
                {!loading && solvedList.slice(0, 6).map((prob, idx) => (
                  <div key={prob._id || idx} className="py-4 flex items-start justify-between">
                    <div>
                      <a href={`/problem/${prob._id}`} className="font-medium text-white">{prob.title}</a>
                      <div className="text-xs text-gray-400">{prob.diffuclty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-emerald-400 font-semibold">Accepted</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;