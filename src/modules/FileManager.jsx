import React, { useState } from 'react';

export default function FileManager() {
  const [files, setFiles] = useState([
    { name: 'server.jar', size: '45.2 MB', date: '2026-01-12', type: 'jar' },
    { name: 'server.properties', size: '2.1 KB', date: '2026-01-10', type: 'yml' },
    { name: 'plugins/', size: 'folder', date: '2026-01-12', type: 'folder' },
    { name: 'world/', size: 'folder', date: '2026-01-11', type: 'folder' },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const getIcon = (type) => {
    if (type === 'jar') return '📦';
    if (type === 'yml') return '⚙️';
    if (type === 'json') return '{}️';
    return '📁';
  };

  const deleteSelected = () => {
    setFiles(files.filter(f => !selectedFiles.includes(f.name)));
    setSelectedFiles([]);
  };

  return (
    <div style={{ padding: '32px', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>File Manager</h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Upload</button>
        <button style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>New Folder</button>
        <button onClick={deleteSelected} disabled={selectedFiles.length === 0} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: selectedFiles.length === 0 ? 0.5 : 1 }}>Delete Selected</button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#334155' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>
                <input type="checkbox" onChange={(e) => e.target.checked ? setSelectedFiles(files.map(f => f.name)) : setSelectedFiles([])} />
              </th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Size</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date Modified</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                <td style={{ padding: '12px' }}>
                  <input type="checkbox" checked={selectedFiles.includes(file.name)} onChange={(e) => e.target.checked ? setSelectedFiles([...selectedFiles, file.name]) : setSelectedFiles(selectedFiles.filter(f => f !== file.name))} />
                </td>
                <td style={{ padding: '12px' }}>{getIcon(file.type)} {file.name}</td>
                <td style={{ padding: '12px' }}>{file.size}</td>
                <td style={{ padding: '12px' }}>{file.date}</td>
                <td style={{ padding: '12px' }}>
                  {file.type !== 'folder' && <button style={{ padding: '4px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
