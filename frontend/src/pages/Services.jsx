import React from 'react'
import ServiceList from '../components/ServiceList'
import sampleData from '../sampleData'
export default function Services(){ return (<div className='container'><h2>Услуги</h2><ServiceList items={sampleData} logged={!!localStorage.getItem('token')} /></div>) }
