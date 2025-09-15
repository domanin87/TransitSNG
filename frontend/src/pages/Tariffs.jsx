import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Tariffs(){
  const [weight, setWeight] = useState(1)
  const [from, setFrom] = useState('Алматы')
  const [to, setTo] = useState('Москва')
  const [price, setPrice] = useState(null)
  const [rate, setRate] = useState({USD: 1, KZT: 450, RUB: 90})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=KZT,RUB,USD')
        if (response.data && response.data.rates) {
          setRate(response.data.rates)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Ошибка загрузки курсов валют:', err)
        setError('Не удалось загрузить актуальные курсы валют. Используются значения по умолчанию.')
        // Оставляем значения по умолчанию, которые уже установлены
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  const calc = () => {
    const base = 100 * weight
    
    // Безопасное извлечение значений с проверкой на существование
    const usdRate = rate?.USD || 1
    const kztRate = rate?.KZT || 450
    const rubRate = rate?.RUB || 90
    
    setPrice({
      usd: base, 
      kzt: Math.round(base * kztRate), 
      rub: Math.round(base * rubRate)
    })
  }

  return (
    <div className="container">
      <h2>Калькулятор тарифов</h2>
      
      {loading && <div>Загрузка курсов валют...</div>}
      {error && <div style={{color: 'orange', marginBottom: '10px'}}>{error}</div>}
      
      <div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'}}>
        <input 
          className="input small" 
          value={weight} 
          onChange={e => setWeight(Number(e.target.value))} 
          type="number" 
          min="0.1"
          step="0.1"
        />
        <input className="input small" value={from} onChange={e => setFrom(e.target.value)} />
        <input className="input small" value={to} onChange={e => setTo(e.target.value)} />
        <button className="btn" onClick={calc} disabled={loading}>
          Рассчитать
        </button>
      </div>
      
      {price && (
        <div style={{marginTop: 12}}>
          <strong>Цена:</strong> {price.usd} USD / {price.kzt} KZT / {price.rub} RUB
        </div>
      )}
    </div>
  )
}