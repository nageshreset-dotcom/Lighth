import './App.css';
import { useEffect, useState } from 'react';
import { useGpt } from './GPTProvider.jsx';
import Panel from './Panel';
import ServerList from './ServerList';
import Dashboard from './Dashboard';
import MainDashboard from './modules/MainDashboard';
import LiveConsole from './modules/LiveConsole';
import FileManager from './modules/FileManager';
import StartupSettings from './modules/StartupSettings';
import Schedules from './modules/Schedules';
import Databases from './modules/Databases';
import SubUsers from './modules/SubUsers';
import Billing from './modules/Billing';

// Home page component with GPT demo
function HomePageContent() {
  const { askGpt, loading, lastResult } = useGpt();
  const [gptInput, setGptInput] = useState('Say hello!');

  return (
    <header className="hero">
      <div className="container">
        <h1 className="brand">LightNode</h1>
        <p className="tag">Reliable Minecraft hosting — simple plans, instant servers.</p>

        <div className="plan-card">
          <h2>Starter Minecraft Server</h2>
          <ul>
            <li><strong>RAM:</strong> 8 GB</li>
            <li><strong>Storage:</strong> 16 GB SSD</li>
            <li><strong>Player slots:</strong> Unlimited (soft limit depends on modpack/performance)</li>
            <li><strong>OS:</strong> Ubuntu 22.04</li>
          </ul>
          <div className="actions">
            <a className="btn primary" href="#/dashboard">Get Started</a>
            <a className="btn" href="#pricing">View details</a>
          </div>
        </div>

        <section className="domain-explain">
          <h3>Domain example</h3>
          <p>
            Your public site could be hosted at a domain like <strong>TLWTroo.com</strong>.
            The server control panel and storefront would use URLs such as
            <span className="code"> https://TLWTroo.com</span> and
            <span className="code"> https://panel.TLWTroo.com</span>.
          </p>
          <p className="small">
            How URLs work: the domain (TLWTroo.com) maps to an IP address via DNS. A browser
            requests that IP and the web server responds with your website files.
          </p>
        </section>

        <section style={{marginTop: 32}}>
          <h3>GPT-4.1 Demo (Global)</h3>
          <form onSubmit={async e => { e.preventDefault(); await askGpt(gptInput); }} style={{display:'flex',gap:8}}>
            <input value={gptInput} onChange={e=>setGptInput(e.target.value)} style={{flex:1}} placeholder="Ask GPT-4.1 anything..." />
            <button className="btn primary" disabled={loading}>Ask</button>
          </form>
          <div style={{marginTop:8,minHeight:40}}>
            {loading ? 'Loading...' : lastResult}
          </div>
        </section>

      </div>
    </header>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    function onHash() {
      setRoute(window.location.hash || '#/');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route.startsWith('#/servers/') && route !== '#/servers') {
    const serverId = route.replace('#/servers/', '');
    return <Panel serverId={serverId} />;
  }

  if (route === '#/servers') {
    return <ServerList />;
  }

  if (route === '#/dashboard' || route === '#/') {
    return <Dashboard />;
  }

  if (route.startsWith('#/panel')) {
    return <Panel />;
  }

  // New module routes
  if (route === '#/main-dashboard') return <MainDashboard />;
  if (route === '#/console') return <LiveConsole />;
  if (route === '#/files') return <FileManager />;
  if (route === '#/startup') return <StartupSettings />;
  if (route === '#/schedules') return <Schedules />;
  if (route === '#/databases') return <Databases />;
  if (route === '#/subusers') return <SubUsers />;
  if (route === '#/billing') return <Billing />;

  // GPT-4.1 demo usage - only show on home page
  const homePage = !route.startsWith('#/servers/') && route !== '#/servers' && route !== '#/dashboard' && !route.startsWith('#/panel') && 
                   route !== '#/main-dashboard' && route !== '#/console' && route !== '#/files' && 
                   route !== '#/startup' && route !== '#/schedules' && route !== '#/databases' && 
                   route !== '#/subusers' && route !== '#/billing';

  return (
    <div className="App" style={{display:'flex',minHeight:'100vh'}}>
      <aside style={{width:220,background:'#181c20',color:'#fff',padding:'32px 0',display:'flex',flexDirection:'column',gap:8}}>
        <div style={{fontWeight:'bold',fontSize:22,marginBottom:24,textAlign:'center'}}>Lighth Modules</div>
        <a href="#/main-dashboard" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Main Dashboard</a>
        <a href="#/console" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Live Console</a>
        <a href="#/files" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>File Manager</a>
        <a href="#/startup" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Startup Settings</a>
        <a href="#/schedules" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Schedules</a>
        <a href="#/databases" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Databases</a>
        <a href="#/subusers" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Sub-Users</a>
        <a href="#/billing" style={{color:'#fff',padding:'8px 24px',textDecoration:'none'}}>Billing</a>
        <div style={{flex:1}}></div>
        <a href="#/" style={{color:'#aaa',padding:'8px 24px',textDecoration:'none'}}>← Home</a>
      </aside>
      <main style={{flex:1}}>
        {homePage ? <HomePageContent /> : null}
      </main>
    </div>
  );
}

export default App;
