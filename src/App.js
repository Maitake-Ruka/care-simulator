import React, { useState } from 'react';
import './App.css';

const CareCostSimulator = () => {
  const [myAge, setMyAge] = useState('');
  const [fatherAge, setFatherAge] = useState('');
  const [fatherOnsetAge, setFatherOnsetAge] = useState('');
  const [fatherLifeAge, setFatherLifeAge] = useState('');
  const [motherAge, setMotherAge] = useState('');
  const [motherOnsetAge, setMotherOnsetAge] = useState('');
  const [motherLifeAge, setMotherLifeAge] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const validate = () => {
    setError('');
    
    const myAgeNum = parseInt(myAge);
    if (!myAge || isNaN(myAgeNum) || myAgeNum < 0) {
      setError('あなたの年齢を正しく入力してください');
      return false;
    }

    const hasFather = fatherAge !== 'none' && fatherAge !== '';
    const hasMother = motherAge !== 'none' && motherAge !== '';

    if (!hasFather && !hasMother) {
      setError('少なくとも父親または母親の情報を入力してください');
      return false;
    }

    if (hasFather) {
      const fatherAgeNum = parseInt(fatherAge);
      const fatherOnsetNum = parseInt(fatherOnsetAge);
      const fatherLifeNum = parseInt(fatherLifeAge);
      
      if (!fatherAge || isNaN(fatherAgeNum) || fatherAgeNum < 0) {
        setError('父親の現在年齢を正しく入力してください');
        return false;
      }
      if (!fatherOnsetAge || isNaN(fatherOnsetNum) || fatherOnsetNum < 65 || fatherOnsetNum > 122) {
        setError('父親の認知症発症予想年齢を65-122歳の範囲で選択してください');
        return false;
      }
      if (!fatherLifeAge || isNaN(fatherLifeNum) || fatherLifeNum < fatherOnsetNum || fatherLifeNum > 122) {
        setError('父親の寿命予想年齢は発症年齢以上で122歳以下にしてください');
        return false;
      }
    }

    if (hasMother) {
      const motherAgeNum = parseInt(motherAge);
      const motherOnsetNum = parseInt(motherOnsetAge);
      const motherLifeNum = parseInt(motherLifeAge);
      
      if (!motherAge || isNaN(motherAgeNum) || motherAgeNum < 0) {
        setError('母親の現在年齢を正しく入力してください');
        return false;
      }
      if (!motherOnsetAge || isNaN(motherOnsetNum) || motherOnsetNum < 65 || motherOnsetNum > 122) {
        setError('母親の認知症発症予想年齢を65-122歳の範囲で選択してください');
        return false;
      }
      if (!motherLifeAge || isNaN(motherLifeNum) || motherLifeNum < motherOnsetNum || motherLifeNum > 122) {
        setError('母親の寿命予想年齢は発症年齢以上で122歳以下にしてください');
        return false;
      }
    }

    return true;
  };

  const calculate = () => {
    if (!validate()) return;

    const myAgeNum = parseInt(myAge);
    const hasFather = fatherAge !== 'none' && fatherAge !== '';
    const hasMother = motherAge !== 'none' && motherAge !== '';

    let fatherCareStart = 0, fatherCareEnd = 0, fatherTotalYears = 0;
    let motherCareStart = 0, motherCareEnd = 0, motherTotalYears = 0;

    if (hasFather) {
      const fatherAgeNum = parseInt(fatherAge);
      const fatherOnsetNum = parseInt(fatherOnsetAge);
      const fatherLifeNum = parseInt(fatherLifeAge);
      
      fatherCareStart = myAgeNum + (fatherOnsetNum - fatherAgeNum);
      fatherCareEnd = myAgeNum + (fatherLifeNum - fatherAgeNum);
      fatherTotalYears = fatherLifeNum - fatherOnsetNum;
    }

    if (hasMother) {
      const motherAgeNum = parseInt(motherAge);
      const motherOnsetNum = parseInt(motherOnsetAge);
      const motherLifeNum = parseInt(motherLifeAge);
      
      motherCareStart = myAgeNum + (motherOnsetNum - motherAgeNum);
      motherCareEnd = myAgeNum + (motherLifeNum - motherAgeNum);
      motherTotalYears = motherLifeNum - motherOnsetNum;
    }

    let overlapYears = 0;
    if (hasFather && hasMother) {
      const overlapStart = Math.max(fatherCareStart, motherCareStart);
      const overlapEnd = Math.min(fatherCareEnd, motherCareEnd);
      overlapYears = Math.max(0, overlapEnd - overlapStart);
    }

    const fatherAloneYears = hasFather ? fatherTotalYears - overlapYears : 0;
    const motherAloneYears = hasMother ? motherTotalYears - overlapYears : 0;

    const fatherAloneCost = fatherAloneYears * 12 * 9;
    const motherAloneCost = motherAloneYears * 12 * 9;
    const overlapCost = overlapYears * 12 * 18;
    const totalCost = fatherAloneCost + motherAloneCost + overlapCost;

    setResult({
      hasFather,
      hasMother,
      fatherCareStart,
      fatherCareEnd,
      fatherTotalYears,
      motherCareStart,
      motherCareEnd,
      motherTotalYears,
      overlapYears,
      fatherAloneYears,
      motherAloneYears,
      fatherAloneCost,
      motherAloneCost,
      overlapCost,
      totalCost,
      myAgeNum
    });
  };

  const ageOptions = [];
  for (let i = 65; i <= 122; i++) {
    ageOptions.push(i);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>未来の私の介護損失シミュレーター</h1>
        <div className="subtitle">30年後のあなたを守るために、今から考えよう</div>
      </div>

      <div className="container">
        {error && (
          <div className="section" style={{backgroundColor: '#ffebee', borderLeft: '4px solid #f44336'}}>
            <p style={{color: '#d32f2f'}}>⚠️ {error}</p>
          </div>
        )}

        <div className="section age-section">
          <h2>あなたの現在年齢</h2>
          <div className="form-group">
            <input
              type="text"
              value={myAge}
              onChange={(e) => setMyAge(e.target.value)}
              placeholder="例：20"
              className="form-input"
            />
            <div className="note">※0歳以上の数値を入力してください</div>
          </div>
        </div>

        <div className="section father-section">
          <h2>父親の情報</h2>
          
          <div className="form-group">
            <label>現在年齢</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input
                type="text"
                value={fatherAge === 'none' ? '' : fatherAge}
                onChange={(e) => setFatherAge(e.target.value)}
                placeholder="例：50"
                className="form-input"
                style={{flex: 1}}
              />
              <button
                onClick={() => setFatherAge('none')}
                className="button"
                style={{
                  background: fatherAge === 'none' ? '#999' : '#ddd',
                  color: fatherAge === 'none' ? 'white' : '#333'
                }}
              >
                いない
              </button>
            </div>
          </div>

          {fatherAge !== 'none' && fatherAge !== '' && (
            <>
              <div className="form-group">
                <label>認知症発症予想年齢</label>
                <select
                  value={fatherOnsetAge}
                  onChange={(e) => setFatherOnsetAge(e.target.value)}
                  className="form-input"
                >
                  <option value="">選択してください</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}歳</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>寿命予想年齢</label>
                <select
                  value={fatherLifeAge}
                  onChange={(e) => setFatherLifeAge(e.target.value)}
                  className="form-input"
                >
                  <option value="">選択してください</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}歳</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="section mother-section">
          <h2>母親の情報</h2>
          
          <div className="form-group">
            <label>現在年齢</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input
                type="text"
                value={motherAge === 'none' ? '' : motherAge}
                onChange={(e) => setMotherAge(e.target.value)}
                placeholder="例：48"
                className="form-input"
                style={{flex: 1}}
              />
              <button
                onClick={() => setMotherAge('none')}
                className="button"
                style={{
                  background: motherAge === 'none' ? '#999' : '#ddd',
                  color: motherAge === 'none' ? 'white' : '#333'
                }}
              >
                いない
              </button>
            </div>
          </div>

          {motherAge !== 'none' && motherAge !== '' && (
            <>
              <div className="form-group">
                <label>認知症発症予想年齢</label>
                <select
                  value={motherOnsetAge}
                  onChange={(e) => setMotherOnsetAge(e.target.value)}
                  className="form-input"
                >
                  <option value="">選択してください</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}歳</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>寿命予想年齢</label>
                <select
                  value={motherLifeAge}
                  onChange={(e) => setMotherLifeAge(e.target.value)}
                  className="form-input"
                >
                  <option value="">選択してください</option>
                  {ageOptions.map(age => (
                    <option key={age} value={age}>{age}歳</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <button onClick={calculate} className="button" style={{width: '100%', fontSize: '1.2rem', padding: '15px'}}>
          📊 シミュレーション実行
        </button>

        {result && (
          <div className="section" style={{marginTop: '30px', background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'}}>
            <h2>📈 介護費用シミュレーション結果</h2>
            
            <div style={{background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
              <h3 style={{color: '#333', marginBottom: '15px', borderBottom: '2px solid #ff6b35', paddingBottom: '8px'}}>
                ■ 介護期間の概要
              </h3>
              {result.hasFather && (
                <p style={{marginBottom: '10px', color: '#555'}}>
                  <strong style={{color: '#1976d2'}}>・父親介護期間：</strong>
                  {result.fatherCareStart}歳時〜{result.fatherCareEnd}歳時
                  （{result.fatherCareStart - result.myAgeNum}年後〜{result.fatherCareEnd - result.myAgeNum}年後、{result.fatherTotalYears}年間）
                </p>
              )}
              {result.hasMother && (
                <p style={{color: '#555'}}>
                  <strong style={{color: '#c2185b'}}>・母親介護期間：</strong>
                  {result.motherCareStart}歳時〜{result.motherCareEnd}歳時
                  （{result.motherCareStart - result.myAgeNum}年後〜{result.motherCareEnd - result.myAgeNum}年後、{result.motherTotalYears}年間）
                </p>
              )}
            </div>

            <div style={{background: 'linear-gradient(135deg, #ff6b35 0%, #ff9a56 100%)', padding: '30px', borderRadius: '16px', color: 'white', textAlign: 'center'}}>
              <p style={{fontSize: '1.2rem', marginBottom: '10px'}}>■ 総費用</p>
              <p style={{fontSize: '3rem', fontWeight: 'bold', margin: '10px 0'}}>{result.totalCost.toLocaleString()}万円</p>
              <p style={{opacity: 0.9}}>今日からの健康管理が、未来のあなたを守ります</p>
            </div>
          </div>
        )}
      </div>

      <div style={{textAlign: 'center', marginTop: '30px', color: '#666', fontSize: '0.9rem'}}>
        <p>※本シミュレーターは教育目的のツールです。実際の介護費用は状況により異なります。</p>
      </div>
    </div>
  );
};

export default CareCostSimulator;
