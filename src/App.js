
import React, { useState } from 'react';
import { AlertCircle, Heart, TrendingUp, Calculator } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-3xl font-bold">未来の私の介護損失シミュレーター</h1>
            </div>
            <p className="text-orange-100">30年後のあなたを守るために、今から考えよう</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="mb-8 bg-orange-50 p-6 rounded-2xl">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                あなたの現在年齢
              </label>
              <input
                type="text"
                value={myAge}
                onChange={(e) => setMyAge(e.target.value)}
                placeholder="例：20"
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
              />
              <p className="text-sm text-gray-600 mt-2">※0歳以上の数値を入力してください</p>
            </div>

            <div className="mb-8 bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">父親</span>
                父親の情報
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">現在年齢</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={fatherAge === 'none' ? '' : fatherAge}
                    onChange={(e) => setFatherAge(e.target.value)}
                    placeholder="例：50"
                    className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setFatherAge('none')}
                    className={`px-6 py-3 rounded-xl font-medium ${
                      fatherAge === 'none'
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    いない
                  </button>
                </div>
              </div>

              {fatherAge !== 'none' && fatherAge !== '' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">認知症発症予想年齢</label>
                    <select
                      value={fatherOnsetAge}
                      onChange={(e) => setFatherOnsetAge(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">選択してください</option>
                      {ageOptions.map(age => (
                        <option key={age} value={age}>{age}歳</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">寿命予想年齢</label>
                    <select
                      value={fatherLifeAge}
                      onChange={(e) => setFatherLifeAge(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none"
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

            <div className="mb-8 bg-pink-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm">母親</span>
                母親の情報
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">現在年齢</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={motherAge === 'none' ? '' : motherAge}
                    onChange={(e) => setMotherAge(e.target.value)}
                    placeholder="例：48"
                    className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setMotherAge('none')}
                    className={`px-6 py-3 rounded-xl font-medium ${
                      motherAge === 'none'
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    いない
                  </button>
                </div>
              </div>

              {motherAge !== 'none' && motherAge !== '' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">認知症発症予想年齢</label>
                    <select
                      value={motherOnsetAge}
                      onChange={(e) => setMotherOnsetAge(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    >
                      <option value="">選択してください</option>
                      {ageOptions.map(age => (
                        <option key={age} value={age}>{age}歳</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">寿命予想年齢</label>
                    <select
                      value={motherLifeAge}
                      onChange={(e) => setMotherLifeAge(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none"
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

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Calculator className="w-6 h-6" />
              シミュレーション実行
            </button>
          </div>

          {result && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 border-t-4 border-orange-500">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-800">介護費用シミュレーション結果</h2>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                  ■ 介護期間の概要
                </h3>
                {result.hasFather && (
                  <p className="mb-2 text-gray-700">
                    <span className="font-bold text-blue-600">・父親介護期間：</span>
                    {result.fatherCareStart}歳時〜{result.fatherCareEnd}歳時
                    （{result.fatherCareStart - result.myAgeNum}年後〜{result.fatherCareEnd - result.myAgeNum}年後、{result.fatherTotalYears}年間）
                  </p>
                )}
                {result.hasMother && (
                  <p className="text-gray-700">
                    <span className="font-bold text-pink-600">・母親介護期間：</span>
                    {result.motherCareStart}歳時〜{result.motherCareEnd}歳時
                    （{result.motherCareStart - result.myAgeNum}年後〜{result.motherCareEnd - result.myAgeNum}年後、{result.motherTotalYears}年間）
                  </p>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                  ■ 期間別費用内訳
                </h3>
                
                {result.fatherAloneYears > 0 && (
                  <div className="mb-4 bg-blue-50 p-4 rounded-xl">
                    <p className="font-bold text-blue-800 mb-2">【単独介護期間①】父親のみ（{result.fatherAloneYears}年間）</p>
                    <p className="text-gray-700">
                      ・月額費用：9万円 × {result.fatherAloneYears * 12}ヶ月 = 
                      <span className="font-bold text-blue-600"> {result.fatherAloneCost.toLocaleString()}万円</span>
                    </p>
                  </div>
                )}

                {result.overlapYears > 0 && (
                  <div className="mb-4 bg-purple-50 p-4 rounded-xl">
                    <p className="font-bold text-purple-800 mb-2">【重複介護期間】両親同時（{result.overlapYears}年間）</p>
                    <p className="text-gray-700">
                      ・月額費用：18万円 × {result.overlapYears * 12}ヶ月 = 
                      <span className="font-bold text-purple-600"> {result.overlapCost.toLocaleString()}万円</span>
                    </p>
                  </div>
                )}

                {result.motherAloneYears > 0 && (
                  <div className="bg-pink-50 p-4 rounded-xl">
                    <p className="font-bold text-pink-800 mb-2">【単独介護期間②】母親のみ（{result.motherAloneYears}年間）</p>
                    <p className="text-gray-700">
                      ・月額費用：9万円 × {result.motherAloneYears * 12}ヶ月 = 
                      <span className="font-bold text-pink-600"> {result.motherAloneCost.toLocaleString()}万円</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-2xl shadow-lg text-white text-center">
                <p className="text-xl mb-2">■ 総費用</p>
                <p className="text-5xl font-bold">{result.totalCost.toLocaleString()}万円</p>
                <p className="mt-4 text-orange-100">今日からの健康管理が、未来のあなたを守ります</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">※本シミュレーターは教育目的のツールです。実際の介護費用は状況により異なります。</p>
        </div>
      </div>
    </div>
  );
};

export default CareCostSimulator;