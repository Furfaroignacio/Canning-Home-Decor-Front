const Loader = ({ texto = 'Cargando' }) => (
  <div className="loader" role="status" aria-live="polite">
    <span className="loader__marca" aria-hidden="true" />
    <span className="loader__texto">{texto}</span>
  </div>
)

export default Loader
