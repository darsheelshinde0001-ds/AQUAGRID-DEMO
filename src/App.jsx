
import React, { useState, useEffect } from "react";

// Demo App: AquaGrid Smart City
export default function App() {
  const FIXED_EMAIL = "admin@aquagrid.com";
  const FIXED_PASS = "Aqua123";

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [zone, setZone] = useState("North Zone");
  const [themeDark, setThemeDark] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState({ valve: false, pump: false, irrigation: false });
  const [wifiOpen, setWifiOpen] = useState(false);

  // Generate demo zone data
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
    setCurrentData(generateZoneData(zone));
    const newAlerts = [];
    const d = generateZoneData(zone);
    if (d.waterPct < 30) newAlerts.push({ id: Date.now() + 1, zone, type: "Low Water Level", severity: "warning", message: `${zone} tank low (${d.waterPct}%)`, time: new Date().toISOString() });
    if (d.turbidity > 3) newAlerts.push({ id: Date.now() + 2, zone, type: "High Turbidity", severity: "critical", message: `${zone} turbidity ${d.turbidity}`, time: new Date().toISOString() });
    if (d.ph > 7.6) newAlerts.push({ id: Date.now() + 3, zone, type: "Abnormal pH", severity: "warning", message: `${zone} pH ${d.ph}`, time: new Date().toISOString() });
    if (d.leak) newAlerts.push({ id: Date.now() + 4, zone, type: "Leak Detected", severity: "critical", message: `${zone} leak detected`, time: new Date().toISOString() });
    setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
  }, [zone]);

  // Authentication
  function handleLogin(email, pass) {
    if (email === FIXED_EMAIL && pass === FIXED_PASS) {
      setUser({ email });
      setPage("dashboard");
      setCurrentData(generateZoneData(zone));
    } else {
      alert("Invalid credentials (use admin@aquagrid.com / Aqua123)");
    }
  }
  function handleLogout() { setUser(null); }

  // Report generator
  function generateReport(range = "daily") {
    const t = currentData.trend.slice();
    const avg = Math.round(t.reduce((a, b) => a + b, 0) / t.length);
    return { range, zone: currentData.zone, avgWaterLevel: avg, max: Math.max(...t), min: Math.min(...t), generatedAt: new Date().toISOString() };
  }

  // UI Components
  function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">AquaGrid — Smart City Demo</h2>
          <label className="block text-sm text-slate-600">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 rounded-md border mt-1 mb-3" placeholder="admin@aquagrid.com" />
          <label className="block text-sm text-slate-600">Password</label>
          <input value={pass} onChange={e => setPass(e.target.value)} type="password" className="w-full p-2 rounded-md border mt-1 mb-4" placeholder="Aqua123" />
          <button onClick={() => handleLogin(email.trim(), pass)} className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium">Sign in</button>
          <p className="text-xs text-slate-500 mt-3">Use <b>admin@aquagrid.com</b> / <b>Aqua123</b> to sign in (demo only).</p>
        </div>
      </div>
    );
  }

  function Card({ title, children }) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-sm border">
        <div className="flex items-center justify-between mb-3"><div className="font-medium text-slate-700">{title}</div></div>
        <div className="text-slate-700">{children}</div>
      </div>
    );
  }

  function Stat({ label, value }) {
    return (
      <div className="p-3 bg-slate-50 rounded-lg">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    );
  }

  function TrendSparkline({ values = [], big = false }) {
    const w = big ? 480 : 200;
    const h = big ? 120 : 48;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    }).join(' ');
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block mt-2"><polyline fill="none" stroke="#2563eb" strokeWidth="2" points={points} /></svg>;
  }

  function TopBar() {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-slate-700">AquaGrid</h1>
          <select value={zone} onChange={e => setZone(e.target.value)} className="rounded-md border p-1 text-sm">
            <option>North Zone</option>
            <option>East Zone</option>
            <option>Central Zone</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWifiOpen(true)} className="px-3 py-1 rounded-md border bg-blue-50">WiFi Connect (Demo)</button>
          <div className="flex items-center gap-2">
            <label className="text-sm">Theme</label>
            <input type="checkbox" checked={themeDark} onChange={() => setThemeDark(!themeDark)} />
          </div>
          <button onClick={handleLogout} className="px-3 py-1 rounded-md border bg-slate-50">Logout</button>
        </div>
      </div>
    );
  }

  function SideNav() {
    const pages = [
      { id: "dashboard", label: "Dashboard" },
      { id: "water", label: "Water Monitoring" },
      { id: "energy", label: "Energy Monitoring" },
      { id: "alerts", label: "Alerts" },
      { id: "reports", label: "Reports" },
      { id: "devices", label: "Device Control" },
      { id: "map", label: "City Map" },
      { id: "settings", label: "Settings" }
    ];
    return (
      <div className="w-56 p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-slate-500 mb-4">Menu</div>
        <div className="flex flex-col gap-2">{pages.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)} className={`text-left p-2 rounded-md ${page === p.id ? "bg-blue-50" : "hover:bg-slate-50"}`}>{p.label}</button>
        ))}</div>
      </div>
    );
  }

  // Dashboard, WaterMonitoring, EnergyMonitoring, AlertsPage, ReportsPage, DeviceControl, CityMap, SettingsPage, WiFiModal
  // (You can include all your other page components here similarly)

  // Render
  if (!user) return <LoginPage />;
  return (
    <div className={`${themeDark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'} min-h-screen`}>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-[260px_1fr] gap-6 px-4">
          <SideNav />
          <div>
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <TopBar />
              <div className="bg-slate-50 p-4">
                {page === 'dashboard' && <Card title="Dashboard Demo">Welcome to AquaGrid Dashboard</Card>}
                {page === 'water' && <Card title="Water Monitoring Demo">Water stats here...</Card>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {wifiOpen && <Card title="WiFi Demo">WiFi Modal Demo</Card>}
    </div>
  );
}
