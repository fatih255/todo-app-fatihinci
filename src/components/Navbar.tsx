import React, { Dispatch, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { userNameStateT } from 'types'


type Props = {
    user: userNameStateT
}

export default function Navbar({ user: { username, setUserName } }: Props) {


    useEffect(() => {
        //default mode
        if (!localStorage.hasOwnProperty('theme')) localStorage.setItem('theme', 'light');
        const darkmodeBtn = document.querySelector('.darkmode-btn') as HTMLElement;
        const lightmodeBtn = document.querySelector('.lightmode-btn') as HTMLElement;
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark')
            darkmodeBtn.style.display = 'none';
            lightmodeBtn.style.display = 'block';
        }
        if (localStorage.getItem('theme') === 'light')
            document.documentElement.classList.add('light')

    }, [])

    const switchThemeHandler = (theme: string) => {
        const darkmodeBtn = document.querySelector('.darkmode-btn') as HTMLElement;
        const lightmodeBtn = document.querySelector('.lightmode-btn') as HTMLElement;
        if (darkmodeBtn && lightmodeBtn) {
            localStorage.setItem('theme', theme)
            if (theme === 'light') {
                darkmodeBtn.style.display = 'block'
                lightmodeBtn.style.display = 'none'
                document.documentElement.classList.add('light')
                document.documentElement.classList.remove('dark')
            };
            if (theme === 'dark') {
                darkmodeBtn.style.display = 'none'
                lightmodeBtn.style.display = 'block'
                document.documentElement.classList.add('dark')
                document.documentElement.classList.remove('light')

            };

        }
    }
    const logoutHandler = () => {
        localStorage.removeItem('username');
        setUserName(null)
    }
    return (
        <div className="px-10 py-8 flex justify-between border-b dark:border-b-slate-800 dark:text-white transition-all duration-1000">
            <div className="text-2xl  ">Todo App</div>
            <div className="flex flex-row  gap-2 items-center justify-center">
                <MdDarkMode onClick={() => switchThemeHandler('dark')} size={40} className="darkmode-btn  rounded-full bg-slate-900 text-white p-1 hover:bg-slate-600 hover:scale-110 transition-all duration-300 cursor-pointer" />
                <MdLightMode onClick={() => switchThemeHandler('light')} size={40} className="lightmode-btn hidden border rounded-full bg-white text-gray-700 p-1 hover:bg-slate-200 hover:scale-110 transition-all duration-300 cursor-pointer" />
                {username &&
                    <>
                        <span>Hoşgeldiniz, </span>
                        <span className="underline font-medium">{username}</span>
                        <hr className="h-full w-[2px] mx-2 bg-slate-100" />
                        <button onClick={logoutHandler} className=" hover:bg-slate-800 py-2 px-3 rounded-md  hover:underline  duration-300 transition-all hover:text-white hover:scale-110 group">
                            <AiOutlineLogout className="rotate-180 group-hover:rotate-0 group-hover:text-white inline mr-2 duration-300  " size={20} />
                            Çıkış Yap
                        </button>
                    </>
                }
            </div>
        </div>
    )
}