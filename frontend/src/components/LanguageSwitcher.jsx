import React from 'react'
import { useTranslation } from 'react-i18next'
const LANGS = [
  {code:'ru', label:'Русский', flag:'🇷🇺'},
  {code:'kk', label:'Қазақша', flag:'🇰🇿'},
  {code:'uz', label:'Oʻzbek', flag:'🇺🇿'},
  {code:'tg', label:'Тоҷикӣ', flag:'🇹🇯'},
  {code:'ky', label:'Кыргызча', flag:'🇰🇬'},
  {code:'hy', label:'Հայերեն', flag:'🇦🇲'},
  {code:'az', label:'Azərbaycanca', flag:'🇦🇿'},
  {code:'be', label:'Беларуская', flag:'🇧🇾'},
  {code:'md', label:'Română', flag:'🇲🇩'},
  {code:'tm', label:'Türkmençe', flag:'🇹🇲'},
  {code:'ge', label:'ქართული', flag:'🇬🇪'}
]
export default function LanguageSwitcher(){
  const { i18n } = useTranslation()
  const change = (code)=>{
    i18n.changeLanguage(code)
    localStorage.setItem('lng', code)
  }
  return (
    <select value={i18n.language} onChange={(e)=>change(e.target.value)} style={{padding:8,borderRadius:8}}>
      {LANGS.map(l=> <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
    </select>
  )
}
