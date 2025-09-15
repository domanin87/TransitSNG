import React from 'react'
import ServiceCard from './ServiceCard'

export default function ServiceList({items,logged,limit=8}){
  const sorted = [...items].sort((a,b)=> (b.rating||0)-(a.rating||0)).slice(0,limit)
  return (<section className='grid'>{sorted.map(i=> <ServiceCard key={i.id} s={i} logged={logged} />)}</section>)
}
