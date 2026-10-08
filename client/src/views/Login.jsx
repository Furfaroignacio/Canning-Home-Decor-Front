import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError(null)
    setEnviando(true)

    try {
      await login(email.trim(), password)
      navigate(location.state?.volverA ?? '/', { replace: true })
    } catch (fallo) {
      setError(
        fallo.status === 403
          ? 'El email o la contraseña no coinciden.'
          : fallo.message
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="acceso">
      <aside className="acceso__panel">
        <p className="acceso__marca">
          <span>Canning</span>
          <span>Home Decor</span>
        </p>
        <p className="acceso__frase">
          Muebles y objetos para la casa, elegidos de a uno.
        </p>
      </aside>

      <section className="acceso__formulario">
        <div className="acceso__caja">
          <h1 className="titulo">Entrar</h1>
          <p className="parrafo-guia">
            Usá el mismo mail con el que creaste tu cuenta.
          </p>

          <form onSubmit={manejarEnvio} noValidate>
            <div className="campo">
              <label className="campo__etiqueta" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="campo__control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="campo">
              <label className="campo__etiqueta" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                className="campo__control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="aviso aviso--error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="boton boton--principal" disabled={enviando}>
              {enviando ? 'Entrando' : 'Entrar'}
            </button>
          </form>

          <p className="parrafo-guia">
            ¿Todavía no tenés cuenta? <Link to="/registro">Crear una</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login
