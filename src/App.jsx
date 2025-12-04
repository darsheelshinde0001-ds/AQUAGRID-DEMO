// App.jsx generated
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const FIXED_EMAIL = "admin@aquagrid.com";
  const FIXED_PASS = "Aqua123";

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [zone, setZone] = useState("North Zone");
  const [themeDark, setThemeDark] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [wifiOpen, setWifiOpen] = useState(false);

  function generateZoneData(zoneName) {
    const turbidity = Math.random() * 5;
    const ph = 6 + Math.random() * 2;
    const leak = Math.random() < 0.1;
    const solar = Math.floor(Math.random() * 100);
    const wind = Math.floor(Math.random() * 50);
    const hydro = Math.floor(Math.random() * 30);
    const battery = Math.floor(Math.random() * 100);
    const waterPct = Math.floor(Math.random() * 100);
    const flowRate = Math.floor(Math.random() * 20 + 5);
    const trend = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    return {
      zone: zoneName,
      turbidity: Number(turbidity.toFixed(2)),
      ph: Number(ph.toFixed(2)),
      leak,
      solar,
      wind,
      hydro,
      battery,
      waterPct,
      flowRate,
      trend,
      timestamp: new Date().toISOString(),
    };
  }

  const [currentData, setCurrentData] = useState(() => generateZoneData(zone));

  useEffect(() => {
    const d = generateZoneData(zone);
    setCurrentData(d);

    const newAlerts = [];
    if (d.waterPct < 30) newAlerts.push({ type: "Low Water Level", message: `${zone} tank low (${d.waterPct}%)` });
    if (d.turbidity > 3) newAlerts.push({ type: "High Turbidity", message: `${zone} turbidity ${d.turbidity}` });
    if (d.leak) newAlerts.push({ type: "Leak Detected", message: `${zone} leak detected` });

    setAlerts(prev => [...newAlerts, ...prev]);
  }, [zone]);

  function handleLogin(email, pass) {
    if (email === FIXED_EMAIL && pass === FIXED_PASS) {
      setUser({ email });
    } else alert("Invalid credentials");
  }

  function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
        <div className="w-full max-w-md p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">AquaGrid Login</h2>
          <input className="w-full p-2 border rounded-md mb-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full p-2 border rounded-md mb-4" placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} />
          <button onClick={() => handleLogin(email, pass)} className="w-full py-2 bg-indigo-600 text-white rounded-lg">Sign in</button>
        </div>
      </div>
    );
  }

  function Card({ title, children }) {
    return (
      <div className="p-4 bg-white/80 backdrop-blur-md rounded-xl shadow border">
        <h3 className="font-semibold text-slate-700 mb-2">{title}</h3>
        {children}
      </div>
    );
  }

  function Sparkline({ values }) {
    const w = 260, h = 80;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const pts = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={w} height={h} className="mt-2">
        <polyline fill="none" stroke="#4f46e5" strokeWidth="3" points={pts} />
      </svg>
    );
  }

  function WaterMonitoring() {
    return (
      <Card title="Water Monitoring">
        <div className="grid grid-cols-2 gap-4">
          <div>Water Level: {currentData.waterPct}%</div>
          <div>Flow Rate: {currentData.flowRate} L/min</div>
        </div>
        <Sparkline values={currentData.trend} />
      </Card>
    );
  }

  function EnergyMonitoring() {
    return (
      <Card title="Energy Monitoring">
        <div className="grid grid-cols-2 gap-4">
          <div>Solar: {currentData.solar}%</div>
          <div>Wind: {currentData.wind}%</div>
          <div>Hydro: {currentData.hydro}%</div>
          <div>Battery: {currentData.battery}%</div>
        </div>
        <Sparkline values={currentData.trend} />
      </Card>
    );
  }

  function FadeCard({ children }) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {children}
      </motion.div>
    );
  }

  function CityMap() {
    return (
      <FadeCard>
        <div className="p-4 bg-white/80 backdrop-blur-md rounded-xl shadow border">
          <h3 className="font-semibold text-slate-700 mb-2">City Map</h3>
          <svg width="100%" height="260" viewBox="0 0 500 260" className="rounded-lg shadow bg-slate-100">
            <rect x="20" y="20" width="140" height="80" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="2" />
            <text x="50" y="65" fill="#1e3a8a" fontSize="14">North Zone</text>

            <rect x="180" y="20" width="140" height="80" fill="#bbf7d0" stroke="#166534" strokeWidth="2" />
            <text x="220" y="65" fill="#166534" fontSize="14">East Zone</text>

            <rect x="340" y="20" width="140" height="80" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
            <text x="365" y="65" fill="#92400e" fontSize="14">West Zone</text>

            <rect x="20" y="120" width="200" height="100" fill="#fecaca" stroke="#991b1b" strokeWidth="2" />
            <text x="70" y="170" fill="#991b1b" fontSize="14">Central Zone</text>

            <rect x="240" y="120" width="240" height="100" fill="#e9d5ff" stroke="#6b21a8" strokeWidth="2" />
            <text x="320" y="170" fill="#6b21a8" fontSize="14">South Zone</text>
          </svg>
        </div>
      </FadeCard>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-[240px_1fr] gap-6">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <button className="block w-full p-2 rounded-md mb-2 bg-slate-100" onClick={() => setPage("dashboard")}>Dashboard</button>
          <button className="block w-full p-2 rounded-md mb-2 bg-slate-100" onClick={() => setPage("water")}>Water Monitoring</button>
          <button className="block w-full p-2 rounded-md mb-2 bg-slate-100" onClick={() => setPage("energy")}>Energy Monitoring</button>
          <button className="block w-full p-2 rounded-md mb-2 bg-slate-100" onClick={() => setPage("map")}>City Map</button>
        </div>

        <div>
          {page === "dashboard" && <Card title="Dashboard">Welcome to AquaGrid Dashboard</Card>}
          {page === "water" && <WaterMonitoring />}
          {page === "energy" && <EnergyMonitoring />}
          {page === "map" && <CityMap />}
        </div>
      </div>
    </div>
  );
}
