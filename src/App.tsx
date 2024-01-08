import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [splitData, setSplitData] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('formatmessage');
    if (message) {
      setSplitData(formatMessage(false, message));
      setInputValue(message)
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleButtonClick(true, inputValue);
      event.preventDefault(); // Prevent form submission & page reload
    }
  };

  const handleButtonClickForGenerateManual = () => {
    handleButtonClick(true, inputValue);
  }

  const handleButtonClickForDisplay = () => {
    handleButtonClick(false, inputValue);
    window.history.pushState({}, '', `?formatmessage=${encodeURIComponent(inputValue)}`);
  }

  const formatMessage = (isAsciidoc: boolean, input: string) : string => {
    const space : string = isAsciidoc ? '{nbsp}{nbsp}' : '    ';
    const parts : string[] = input.replace(/\|$/, '').split('|');
    
    for (let i = 0; i < parts.length; i++) {
      if (isAsciidoc && (parts[i].startsWith('CONVERSATIONID') || parts[i].startsWith('CREATIONTIME') || parts[i].startsWith('PLUGINORIGINATOR') || parts[i].startsWith('PLUGINOWNER') || parts[i].startsWith('ULFROMSESSIONNAME') || parts[i].startsWith('ULTOSESSIONNAME'))) {  
        parts[i] = ''
      } else {
        const index = parts[i].indexOf('=');
        const key = parts[i].substring(0, index)
        let value = parts[i].substring(index + 1)
        if (!value.includes('')) {
          parts[i] = key + '=' + value + '\n';
        }
        else if (!value.includes('')){
          const values1 = value.replace(//g, '|').replace(/\|$/, '').split('|').map((value1) => space + value1 + '\n').join('');
          parts[i] = key + '=\n' + values1 + '\n';
        }
        else {
          const values1 = value.replace(//g, '###').replace(//g, '|').replace(/\|$/, '').split('|')
          const result = values1.map((value1) => {
            if (value1.includes('###')) {
              const index2 = value1.indexOf('=');
              const key2 = value1.substring(0, index2)
              let value2 = value1.substring(index2 + 1)
              const formatedContent = value2.replace(/###/g, '|').replace(/\|$/, '').split('|').map((c) => space + space + c + '\n').join('');
              return space + key2 + '=\n' + formatedContent + '\n';
            } else {
            return space + value1 + '\n'
            }
          }).join('');
          parts[i] = key + '=\n' + result.replace(/\n\n+/, "\n") + '\n';
        }
      }
    }
    let result = parts.join('').replace(/\n\n+/, "\n");
    if (isAsciidoc) {
      result = result.replace(/\n/gm, " +\n").replace(/ \+\n$/, '');
    }
    return result;
  }

  const handleButtonClick = (isAsciidoc: boolean, input: string) => {
    setSplitData(formatMessage(isAsciidoc, input));
  };

  return (
    <div className="App">
      <header className="App-header">
        Message formatter for manual
        <input type="text" value={inputValue} onChange={handleInputChange} onKeyPress={handleKeyPress} style={{width: '90%'}}/>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '200px'}}>
          <button onClick={handleButtonClickForGenerateManual}>Format</button>
          <button onClick={handleButtonClickForDisplay}>Display</button>
        </div>
        <textarea readOnly value={splitData} style={{width: '90%', height: '75vh'}} />
      </header>
    </div>
  );
}

export default App;