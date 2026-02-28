import { NavLink } from 'react-router-dom'
import digitalBrainLogo from '../assets/digital brain.png'

function Header() {
  const linkClass = ({ isActive }) =>
    `text-white hover:text-gray-300 text-lg tracking-wider ${isActive ? 'border-b-2 border-white' : ''}`

  return (
    <header className="w-full py-4 px-6 flex items-center bg-gradient-to-b from-[#090816] to-transparent">
      <NavLink to="/">
        <img src={digitalBrainLogo} alt="Digital Brain" className="h-14 mr-8" />
      </NavLink>
      <nav className="flex gap-8 flex-1 justify-center" style={{ fontFamily: 'Syncopate, sans-serif' }}>
        <NavLink to="/" className={linkClass}>INICIO</NavLink>
        <NavLink to="/categorias" className={linkClass}>CATEGORÍAS</NavLink>
        <NavLink to="/graficos" className={linkClass}>GRÁFICOS</NavLink>
      </nav>
    </header>
  )
}

export default Header
