"use client";
import Link from "next/link";
import { useState } from "react";
import useLastPageCookie from "../hooks/uselastPageCookie";
import Breadcrumbs from "./Breadcrumbs";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark");
  };

  return (
    <header>
      
      {/* Student Number */}
      <span className="student-number">22206653</span>

      {/* Always visible desktop nav */}
      <nav className="desktop-nav" role="navigation">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/escape-room">Escape Room</Link></li>
          <li><Link href="/coding-races">Coding Races</Link></li>
          <li><Link href="/court-rooms">Court Rooms</Link></li>
          <li><Link href="/tabs-generator">Tabs Generator</Link></li>
        </ul>
      </nav>
      
      {/* Controls (hamburger + theme toggle) */}
      <div className="header-controls">
        <button
          className={`hamburger ${isOpen ? "is-active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Dropdown Nav (works on desktop + mobile) */}
      <nav
        id="mobile-navigation"
        className={`nav-links ${isOpen ? "open" : ""}`}
        role="navigation"
      >
        <ul>
          <li><Link href="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link href="/about" onClick={() => setIsOpen(false)}>About</Link></li>
          <li><Link href="/escape-room" onClick={() => setIsOpen(false)}>Escape Room</Link></li>
          <li><Link href="/coding-races" onClick={() => setIsOpen(false)}>Coding Races</Link></li>
          <li><Link href="/court-rooms" onClick={() => setIsOpen(false)}>Court Rooms</Link></li>
          <li><Link href="/tabs-generator" onClick={() => setIsOpen(false)}>Tabs Generator</Link></li>
        </ul>
      </nav>
    </header>
    
  );
}
