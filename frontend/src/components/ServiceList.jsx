import React from 'react'
import ServiceCard from './ServiceCard'
export default function ServiceList({items,logged}){
  return (<section className='grid'>{items.map(i=> <ServiceCard key={i.id} s={i} showContact={logged} />)}</section>)
}
