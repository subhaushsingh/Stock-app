import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navitems from './Navitems'
import Userdropdown from './Userdropdown'

const Header = ({user}:{user:User}) => {
  return (
    <header className='sticky top-0 z-50 w-full h-17.5 bg-gray-800'>
      <div className='flex justify-between items-center px-6 py-4 text-gray-500 mx-auto max-w-screen-2xl  md:px-6 lg:px-8'>
        <Link href='/'>
           <Image src="/assets/icons/logo.svg" alt='logo' width={140} height={32} className='h-8 w-auto cursor-pointer'/>   
        </Link>
        <nav className='hidden sm:block'>
            <Navitems/>
        </nav>
          <Userdropdown user={user}/>
      </div>
    </header>
  )
}

export default Header
