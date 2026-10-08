import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FORMULARIO_VACIO = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  password: '',
}

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [datos, setDatos] = useState(FORMULARIO_VACIO)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Un solo manejador para todos los campos: usa el name del input.
  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setDatos((anterior) => ({ ...anterior, [name]: value }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError(null)
    setEnviando(true)

    try {
      // El rol siempre es USER: nadie se crea administrador desde el registro.
      await register({ ...datos, email: datos.email.trim(), role: 'USER' })
      navigate('/', { replace: true })
    } catch (fallo) {
      setError(
        fallo.status === 500
          ? 'Ese email o nombre de usuario ya esta en uso.'
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
          <h1 className="titulo">Crear cuenta</h1>
          <p className="parrafo-guia">Te lleva menos de un minuto.</p>

          <form onSubmit={manejarEnvio} noValidate>
            <div className="campo-doble">
              <div className="campo">
                <label className="campo__etiqueta" htmlFor="firstname">
                  Nombre
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  className="campo__control"
                  value={datos.firstname}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="campo">
                <label className="campo__etiqueta" htmlFor="lastname">
                  Apellido
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  className="campo__control"
                  value={datos.lastname}
                  onChange={manejarCambio}
                  required
                />
              </div>
            </div>

            <div className="campo">
              <label className="campo__etiqueta" htmlFor="username">
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                className="campo__control"
                value={datos.username}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="campo">
              <label className="campo__etiqueta" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                className="campo__control"
                type="email"
                value={datos.email}
                onChange={manejarCambio}
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
                name="password"
                className="campo__control"
                type="password"
                value={datos.password}
                onChange={manejarCambio}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="aviso aviso--error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="boton boton--principal" disabled={enviando}>
              {enviando ? 'Creando' : 'Crear cuenta'}
            </button>
          </form>

          <p className="parrafo-guia">
            ¿Ya tenes cuenta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Register
