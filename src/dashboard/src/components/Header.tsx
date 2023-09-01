/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import React, { useState } from "react";
import styles from '@/styles/navbar.module.scss';
import config from '@/config/config';
import { FaBars, FaTimes } from 'react-icons/fa';
import { User } from '@/types/types';



export default function Header({ user }: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.headerLogo}>
                    <Link href="/" legacyBehavior={true}>
                        <a>
                            <img src={`${config.logo}`} alt="Lavamusic" />
                        </a>
                    </Link>
                    
                </div>
                <div className={styles.headerMenu}>
                    <div className={styles.headerMenuList}>
                        {config.menuList.map((item, idx) => {
                            return (
                                <div key={idx} className={styles.headerMenuListItem}>
                                    <Link href={item.href} legacyBehavior={true}>
                                        <a>{item.text}</a>
                                    </Link>
                                </div>
                            );
                        }
                        )}
                    </div>
                    {/* user profile */}
                    {user && (
                        <div className='flex flex-row items-center justify-center'>
                            <img src={`https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}.png`} className="rounded-md w-10 h-10 mx-auto mb-2 transform hover:scale-110 duration-100 shadow-lg" />
                            <div className="text-white-400 font-bold pr-1 mb-2 text-center hover:shadow-lg">{user.username}</div>
                        </div>
                    )}
                </div>
                <div className={styles.headerMenuMobile}>
                    <div className={styles.headerMenuMobileButton} onClick={toggleMobileMenu}>
                        <div className={styles.headerMenuMobileButtonIcon}>
                            {isMobileMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
                        </div>
                    </div>
                    <div className={`${styles.headerMenuMobileList} ${isMobileMenuOpen ? styles.active : ''}`}>
                        {config.menuList.map((item, idx) => {
                            const delay = idx * 0.1;
                            const itemStyle = {
                                animation: `${styles.slideIn} 0.3s ease ${delay}s both`
                            };
                            return (
                                <div key={idx} className={`${styles.headerMenuMobileListItem} ${isMobileMenuOpen ? styles.active : ''}`} style={itemStyle}>
                                    <Link href={item.href} legacyBehavior={true}>
                                        <a>{item.text}</a>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
};



type Props = {
    user?: User | any;
}

