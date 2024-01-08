import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [splitData, setSplitData] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    const parts : string[] = inputValue.replace(/\|$/, '').split('|');
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith('CONVERSATIONID') || parts[i].startsWith('CREATIONTIME') || parts[i].startsWith('PLUGINORIGINATOR') || parts[i].startsWith('PLUGINOWNER') || parts[i].startsWith('ULFROMSESSIONNAME') || parts[i].startsWith('ULTOSESSIONNAME')) {  
        parts[i] = ''
      } else {
        const index = parts[i].indexOf('=');
        const key = parts[i].substring(0, index)
        let value = parts[i].substring(index + 1)
        if (!value.includes('')) {
          parts[i] = key + '=' + value + '\n';
        }
        else if (!value.includes('')){
          const values1 = value.replace(//g, '|').replace(/\|$/, '').split('|').map((value1) => '{nbsp}{nbsp}' + value1 + '\n').join('');
          parts[i] = key + '=\n' + values1 + '\n';
        }
        else {
          const values1 = value.replace(//g, '###').replace(//g, '|').replace(/\|$/, '').split('|')
          const result = values1.map((value1) => {
            if (value1.includes('###')) {
              const index2 = value1.indexOf('=');
              const key2 = value1.substring(0, index2)
              let value2 = value1.substring(index2 + 1)
              const vv = value2.replace(/###/g, '|').replace(/\|$/, '').split('|').map((c) => '{nbsp}{nbsp}{nbsp}{nbsp}' + c + '\n').join('');
              return "{nbsp}{nbsp}" + key2 + '=\n' + vv + '\n';
            } else {
            return '{nbsp}{nbsp}' + value1 + '\n'
            }
          }).join('');
          parts[i] = key + '=\n' + result.replace(/\n\n+/, "\n") + '\n';
        }
      }
    }
    setSplitData(parts);
  };

  return (
    <div className="App">
      <header className="App-header">
        Message disiplayer for manual
        <input type="text" value={inputValue} onChange={handleInputChange} style={{width: '89%'}}/>
        <button onClick={handleButtonClick}>Split</button>
        <textarea readOnly value={splitData.join('').replace(/\n\n+/, "\n")} style={{width: '90%', height: '75vh'}} />
      </header>
    </div>
  );
}

export default App;